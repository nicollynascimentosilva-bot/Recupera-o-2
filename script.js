/* =========================================================
   PROJETOLAB — SCRIPT PRINCIPAL
   ========================================================= */

'use strict';

/* =========================================================
   ELEMENTOS
   ========================================================= */

const body = document.body;

const themeToggle = document.getElementById('themeToggle');
const menuToggle = document.getElementById('menuToggle');
const nav = document.querySelector('.nav');

const modal = document.getElementById('modal');
const modalClose = document.getElementById('modalClose');
const modalTitle = document.getElementById('modalTitle');
const modalText = document.getElementById('modalText');
const modalNumber = document.getElementById('modalNumber');
const modalKicker = document.getElementById('modalKicker');
const modalImpact = document.getElementById('modalImpact');

const processDetail = document.getElementById('processDetail');

const reflectionForm = document.getElementById('reflectionForm');
const discoveryOne = document.getElementById('discoveryOne');
const discoveryTwo = document.getElementById('discoveryTwo');

const countOne = document.getElementById('countOne');
const countTwo = document.getElementById('countTwo');

const saveStatus = document.getElementById('saveStatus');
const clearReflection = document.getElementById('clearReflection');


/* =========================================================
   DADOS DAS DESCOBERTAS
   ========================================================= */

const discoveries = {
  1: {
    number: '01',
    kicker: 'NOVO APRENDIZADO',
    title: 'Entendemos melhor o problema',
    text:
      'Durante a pesquisa e o desenvolvimento, percebemos que o problema investigado possuía mais aspectos do que imaginávamos inicialmente. Essa descoberta fez com que o grupo pesquisasse melhor, comparasse informações e pensasse com mais cuidado antes de definir a solução.',
    impact:
      'A pesquisa passou a orientar melhor as decisões do projeto.'
  },

  2: {
    number: '02',
    kicker: 'MUDANÇA DE PERSPECTIVA',
    title: 'Nossa solução evoluiu',
    text:
      'Ao testar ideias e conversar sobre os resultados, percebemos que a primeira proposta poderia ser melhorada. O grupo passou a considerar novas possibilidades e modificou alguns pontos para tornar a solução mais adequada ao problema.',
    impact:
      'A solução final ficou mais coerente com as necessidades identificadas.'
  }
};


/* =========================================================
   DADOS DA TIMELINE
   ========================================================= */

const processSteps = [
  {
    label: 'ETAPA 01',
    title: 'Investigar antes de concluir',
    text:
      'O grupo reuniu informações, comparou ideias e percebeu que compreender bem o problema era essencial para criar uma solução mais coerente.'
  },

  {
    label: 'ETAPA 02',
    title: 'Questionar o que já tínhamos pensado',
    text:
      'Durante as conversas e análises, novas perguntas apareceram. Isso ajudou o grupo a perceber possibilidades que não estavam presentes na ideia inicial.'
  },

  {
    label: 'ETAPA 03',
    title: 'Transformar percepção em melhoria',
    text:
      'As novas descobertas foram utilizadas para ajustar o projeto. Assim, o processo deixou de ser apenas uma execução e passou a ser uma evolução contínua.'
  }
];


/* =========================================================
   TEMA CLARO / ESCURO
   ========================================================= */

function updateThemeButton() {
  if (!themeToggle) return;

  const isLight = body.classList.contains('light');

  themeToggle.textContent = isLight ? '☀' : '☾';

  themeToggle.setAttribute(
    'aria-label',
    isLight
      ? 'Ativar tema escuro'
      : 'Ativar tema claro'
  );

  themeToggle.setAttribute(
    'title',
    isLight
      ? 'Ativar tema escuro'
      : 'Ativar tema claro'
  );
}


function loadTheme() {
  try {
    const savedTheme = localStorage.getItem('projetolab-theme');

    if (savedTheme === 'light') {
      body.classList.add('light');
    } else {
      body.classList.remove('light');
    }
  } catch (error) {
    console.warn(
      'Não foi possível carregar o tema salvo.',
      error
    );
  }

  updateThemeButton();
}


function toggleTheme() {
  const isLight = body.classList.toggle('light');

  try {
    localStorage.setItem(
      'projetolab-theme',
      isLight ? 'light' : 'dark'
    );
  } catch (error) {
    console.warn(
      'Não foi possível salvar o tema.',
      error
    );
  }

  updateThemeButton();
}


if (themeToggle) {
  themeToggle.addEventListener(
    'click',
    toggleTheme
  );
}

loadTheme();


/* =========================================================
   MENU MOBILE
   ========================================================= */

function closeMenu() {
  if (!nav || !menuToggle) return;

  nav.classList.remove('open');

  menuToggle.setAttribute(
    'aria-expanded',
    'false'
  );
}


function toggleMenu() {
  if (!nav || !menuToggle) return;

  const isOpen =
    nav.classList.toggle('open');

  menuToggle.setAttribute(
    'aria-expanded',
    String(isOpen)
  );
}


if (menuToggle) {
  menuToggle.addEventListener(
    'click',
    toggleMenu
  );
}


if (nav) {
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener(
      'click',
      closeMenu
    );
  });
}


/* =========================================================
   ANIMAÇÃO DOS ELEMENTOS AO ROLAR
   ========================================================= */

const revealElements =
  document.querySelectorAll('.reveal');


function revealOnScroll() {

  const windowHeight =
    window.innerHeight;

  revealElements.forEach(element => {

    const elementTop =
      element.getBoundingClientRect().top;

    const visible =
      elementTop <
      windowHeight - 70;

    if (visible) {
      element.classList.add('visible');
    }

  });
}


if ('IntersectionObserver' in window) {

  const observer =
    new IntersectionObserver(
      entries => {

        entries.forEach(entry => {

          if (entry.isIntersecting) {

            entry.target.classList.add(
              'visible'
            );

            observer.unobserve(
              entry.target
            );
          }

        });

      },
      {
        threshold: 0.12
      }
    );

  revealElements.forEach(element => {
    observer.observe(element);
  });

} else {

  window.addEventListener(
    'scroll',
    revealOnScroll
  );

  revealOnScroll();
}


/* =========================================================
   MODAL DAS DESCOBERTAS
   ========================================================= */

let lastFocusedElement = null;


function openModal(id) {

  const discovery =
    discoveries[id];

  if (!discovery || !modal) return;

  lastFocusedElement =
    document.activeElement;

  modalNumber.textContent =
    discovery.number;

  modalKicker.textContent =
    discovery.kicker;

  modalTitle.textContent =
    discovery.title;

  modalText.textContent =
    discovery.text;

  modalImpact.textContent =
    discovery.impact;

  modal.classList.add('open');

  modal.setAttribute(
    'aria-hidden',
    'false'
  );

  body.style.overflow = 'hidden';

  if (modalClose) {
    modalClose.focus();
  }
}


function closeModal() {

  if (!modal) return;

  modal.classList.remove('open');

  modal.setAttribute(
    'aria-hidden',
    'true'
  );

  body.style.overflow = '';

  if (
    lastFocusedElement &&
    typeof lastFocusedElement.focus === 'function'
  ) {
    lastFocusedElement.focus();
  }
}


document
  .querySelectorAll('.open-modal')
  .forEach(button => {

    button.addEventListener(
      'click',
      () => {

        const id =
          button.dataset.id;

        openModal(id);
      }
    );

  });


if (modalClose) {
  modalClose.addEventListener(
    'click',
    closeModal
  );
}


document
  .querySelectorAll('[data-close-modal]')
  .forEach(element => {

    element.addEventListener(
      'click',
      closeModal
    );

  });


document.addEventListener(
  'keydown',
  event => {

    if (
      event.key === 'Escape' &&
      modal &&
      modal.classList.contains('open')
    ) {
      closeModal();
    }

  }
);


/* =========================================================
   TIMELINE INTERATIVA
   ========================================================= */

const timelineItems =
  document.querySelectorAll(
    '.timeline-item'
  );


function updateProcess(step) {

  const data =
    processSteps[step];

  if (!data || !processDetail) {
    return;
  }

  const label =
    processDetail.querySelector(
      '.detail-label'
    );

  const title =
    processDetail.querySelector('h3');

  const text =
    processDetail.querySelector('p');

  if (label) {
    label.textContent =
      data.label;
  }

  if (title) {
    title.textContent =
      data.title;
  }

  if (text) {
    text.textContent =
      data.text;
  }

  timelineItems.forEach(
    (item, index) => {

      item.classList.toggle(
        'active',
        index === step
      );

    }
  );
}


timelineItems.forEach(
  (item, index) => {

    item.addEventListener(
      'click',
      () => {
        updateProcess(index);
      }
    );

  }
);


/* =========================================================
   CONTADOR DE CARACTERES
   ========================================================= */

function updateCounter(
  textarea,
  counter
) {

  if (!textarea || !counter) {
    return;
  }

  const length =
    textarea.value.length;

  const maximum =
    textarea.maxLength;

  counter.textContent =
    `${length}/${maximum}`;

  if (length >= maximum * 0.9) {

    counter.style.color =
      '#ff4fd8';

  } else {

    counter.style.color =
      '';
  }
}


if (discoveryOne) {

  discoveryOne.addEventListener(
    'input',
    () => {
      updateCounter(
        discoveryOne,
        countOne
      );
    }
  );

}


if (discoveryTwo) {

  discoveryTwo.addEventListener(
    'input',
    () => {
      updateCounter(
        discoveryTwo,
        countTwo
      );
    }
  );

}


/* =========================================================
   SALVAR REFLEXÕES
   ========================================================= */

const STORAGE_KEY =
  'projetolab-reflexoes';


function showStatus(
  message,
  success = true
) {

  if (!saveStatus) return;

  saveStatus.textContent =
    message;

  saveStatus.style.color =
    success
      ? ''
      : '#ff4fd8';

  window.clearTimeout(
    showStatus.timeout
  );

  showStatus.timeout =
    window.setTimeout(
      () => {

        saveStatus.textContent =
          '';

      },
      4000
    );
}


function saveReflections() {

  if (!discoveryOne || !discoveryTwo) {
    return;
  }

  const data = {
    discoveryOne:
      discoveryOne.value.trim(),

    discoveryTwo:
      discoveryTwo.value.trim(),

    savedAt:
      new Date().toISOString()
  };

  try {

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(data)
    );

    showStatus(
      '✓ Reflexões salvas neste navegador.'
    );

  } catch (error) {

    showStatus(
      'Não foi possível salvar as reflexões.',
      false
    );

    console.error(
      'Erro ao salvar:',
      error
    );
  }
}


/* =========================================================
   CARREGAR REFLEXÕES
   ========================================================= */

function loadReflections() {

  try {

    const saved =
      localStorage.getItem(
        STORAGE_KEY
      );

    if (!saved) return;

    const data =
      JSON.parse(saved);

    if (
      data &&
      typeof data === 'object'
    ) {

      if (
        discoveryOne &&
        typeof data.discoveryOne === 'string'
      ) {

        discoveryOne.value =
          data.discoveryOne;

      }

      if (
        discoveryTwo &&
        typeof data.discoveryTwo === 'string'
      ) {

        discoveryTwo.value =
          data.discoveryTwo;

      }

    }

  } catch (error) {

    console.warn(
      'Não foi possível carregar as reflexões salvas.',
      error
    );

  }

  updateCounter(
    discoveryOne,
    countOne
  );

  updateCounter(
    discoveryTwo,
    countTwo
  );
}


loadReflections();


/* =========================================================
   FORMULÁRIO
   ========================================================= */

if (reflectionForm) {

  reflectionForm.addEventListener(
    'submit',
    event => {

      event.preventDefault();

      if (!reflectionForm.checkValidity()) {

        reflectionForm.reportValidity();

        showStatus(
          'Preencha as duas descobertas antes de salvar.',
          false
        );

        return;
      }

      saveReflections();

    }
  );

}


/* =========================================================
   LIMPAR REFLEXÕES
   ========================================================= */

if (clearReflection) {

  clearReflection.addEventListener(
    'click',
    () => {

      if (discoveryOne) {
        discoveryOne.value = '';
      }

      if (discoveryTwo) {
        discoveryTwo.value = '';
      }

      updateCounter(
        discoveryOne,
        countOne
      );

      updateCounter(
        discoveryTwo,
        countTwo
      );

      try {

        localStorage.removeItem(
          STORAGE_KEY
        );

      } catch (error) {

        console.warn(
          'Não foi possível remover os dados salvos.',
          error
        );

      }

      showStatus(
        'Reflexões apagadas.'
      );

    }
  );

}


/* =========================================================
   FECHAR MENU AO CLICAR FORA
   ========================================================= */

document.addEventListener(
  'click',
  event => {

    if (
      !nav ||
      !menuToggle ||
      !nav.classList.contains('open')
    ) {
      return;
    }

    const clickedInsideMenu =
      nav.contains(event.target);

    const clickedButton =
      menuToggle.contains(event.target);

    if (
      !clickedInsideMenu &&
      !clickedButton
    ) {
      closeMenu();
    }

  }
);


/* =========================================================
   ESC FECHA MENU MOBILE
   ========================================================= */

document.addEventListener(
  'keydown',
  event => {

    if (
      event.key === 'Escape' &&
      nav &&
      nav.classList.contains('open')
    ) {
      closeMenu();
    }

  }
);


/* =========================================================
   FECHAR MENU QUANDO A TELA VOLTAR AO DESKTOP
   ========================================================= */

window.addEventListener(
  'resize',
  () => {

    if (
      window.innerWidth > 900
    ) {
      closeMenu();
    }

  }
);


/* =========================================================
   INICIALIZAÇÃO
   ========================================================= */

document.addEventListener(
  'DOMContentLoaded',
  () => {

    updateCounter(
      discoveryOne,
      countOne
    );

    updateCounter(
      discoveryTwo,
      countTwo
    );

    updateProcess(0);

  }
);

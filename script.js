(() => {

  "use strict";


  /* ========================================
     SELETORES
  ======================================== */

  const $ = (
    selector,
    parent = document
  ) => parent.querySelector(selector);

  const $$ = (
    selector,
    parent = document
  ) => [...parent.querySelectorAll(selector)];


  const body = document.body;

  const themeButton =
    $("#themeButton");

  const menuButton =
    $("#menuButton");

  const mobileNavigation =
    $("#mobileNavigation");


  /* ========================================
     TEMA
  ======================================== */

  function applyTheme(theme) {

    const isLight =
      theme === "light";

    body.classList.toggle(
      "light",
      isLight
    );

    if (themeButton) {

      themeButton.textContent =
        isLight
          ? "☀"
          : "☾";

      themeButton.setAttribute(
        "aria-label",
        isLight
          ? "Ativar tema escuro"
          : "Ativar tema claro"
      );
    }
  }


  const savedTheme =
    localStorage.getItem(
      "projetolab-theme"
    );


  applyTheme(
    savedTheme === "light"
      ? "light"
      : "dark"
  );


  if (themeButton) {

    themeButton.addEventListener(
      "click",
      () => {

        const nextTheme =
          body.classList.contains("light")
            ? "dark"
            : "light";

        applyTheme(nextTheme);

        localStorage.setItem(
          "projetolab-theme",
          nextTheme
        );

      }
    );

  }


  /* ========================================
     MENU MOBILE
  ======================================== */

  function closeMobileMenu() {

    if (!mobileNavigation) {
      return;
    }

    mobileNavigation.classList.remove(
      "open"
    );

    if (menuButton) {

      menuButton.setAttribute(
        "aria-expanded",
        "false"
      );

    }

  }


  if (menuButton) {

    menuButton.addEventListener(
      "click",
      () => {

        const opened =
          mobileNavigation.classList.toggle(
            "open"
          );

        menuButton.setAttribute(
          "aria-expanded",
          String(opened)
        );

      }
    );

  }


  $$(".mobile-navigation a")
    .forEach(link => {

      link.addEventListener(
        "click",
        closeMobileMenu
      );

    });


  window.addEventListener(
    "resize",
    () => {

      if (window.innerWidth > 900) {

        closeMobileMenu();

      }

    }
  );


  /* ========================================
     ANIMAÇÃO AO ROLAR
  ======================================== */

  const revealElements =
    $$(".reveal");


  if (
    "IntersectionObserver"
    in window
  ) {

    const observer =
      new IntersectionObserver(
        entries => {

          entries.forEach(
            entry => {

              if (
                entry.isIntersecting
              ) {

                entry.target.classList.add(
                  "visible"
                );

                observer.unobserve(
                  entry.target
                );

              }

            }
          );

        },
        {
          threshold: 0.12
        }
      );


    revealElements.forEach(
      element =>
        observer.observe(element)
    );

  } else {

    revealElements.forEach(
      element =>
        element.classList.add(
          "visible"
        )
    );

  }


  /* ========================================
     MODAL DAS DESCOBERTAS
  ======================================== */

  const modal =
    $("#modal");

  const modalClose =
    $("#modalClose");

  const modalNumber =
    $("#modalNumber");

  const modalCategory =
    $("#modalCategory");

  const modalTitle =
    $("#modalTitle");

  const modalText =
    $("#modalText");

  const modalImpact =
    $("#modalImpact");


  const discoveries = {

    1: {

      number: "01",

      category:
        "NOVO APRENDIZADO",

      title:
        "Entendemos melhor o problema",

      text:
        "Durante a pesquisa e o desenvolvimento, percebemos que o problema investigado possuía mais aspectos do que imaginávamos inicialmente. Essa descoberta fez com que o grupo pesquisasse melhor, comparasse informações e pensasse com mais cuidado antes de definir a solução.",

      impact:
        "A pesquisa passou a orientar melhor as decisões do projeto."

    },


    2: {

      number: "02",

      category:
        "MUDANÇA DE PERSPECTIVA",

      title:
        "Nossa solução evoluiu",

      text:
        "Ao testar ideias e conversar sobre os resultados, percebemos que a primeira proposta poderia ser melhorada. O grupo passou a considerar novas possibilidades e modificou pontos importantes para tornar a solução mais adequada ao problema.",

      impact:
        "A solução final ficou mais coerente com as necessidades identificadas."

    }

  };


  let lastFocusedElement = null;


  function openModal(id) {

    const discovery =
      discoveries[id];

    if (
      !discovery ||
      !modal
    ) {
      return;
    }


    lastFocusedElement =
      document.activeElement;


    modalNumber.textContent =
      discovery.number;

    modalCategory.textContent =
      discovery.category;

    modalTitle.textContent =
      discovery.title;

    modalText.textContent =
      discovery.text;

    modalImpact.textContent =
      discovery.impact;


    modal.classList.add(
      "open"
    );

    modal.setAttribute(
      "aria-hidden",
      "false"
    );

    body.style.overflow =
      "hidden";


    modalClose?.focus();

  }


  function closeModal() {

    if (!modal) {
      return;
    }


    modal.classList.remove(
      "open"
    );

    modal.setAttribute(
      "aria-hidden",
      "true"
    );

    body.style.overflow =
      "";


    if (
      lastFocusedElement &&
      typeof lastFocusedElement.focus
        === "function"
    ) {

      lastFocusedElement.focus();

    }

  }


  $$("[data-discovery]")
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          const id =
            Number(
              button.dataset.discovery
            );

          openModal(id);

        }
      );

    });


  modalClose?.addEventListener(
    "click",
    closeModal
  );


  $$("[data-close-modal]")
    .forEach(element => {

      element.addEventListener(
        "click",
        closeModal
      );

    });


  /* ========================================
     TIMELINE
  ======================================== */

  const timelineSteps =
    $$(".timeline-step");

  const processPanel =
    $("#processPanel");


  const processData = [

    {

      category:
        "ETAPA 01",

      title:
        "Investigar antes de concluir",

      text:
        "O grupo reuniu informações, comparou ideias e percebeu que compreender bem o problema era essencial para criar uma solução mais coerente."

    },


    {

      category:
        "ETAPA 02",

      title:
        "Questionar o que já tínhamos pensado",

      text:
        "Durante as conversas e análises, novas perguntas apareceram. Isso ajudou o grupo a perceber possibilidades que não estavam presentes na ideia inicial."

    },


    {

      category:
        "ETAPA 03",

      title:
        "Transformar percepção em melhoria",

      text:
        "As novas descobertas foram utilizadas para ajustar o projeto. Assim, o processo deixou de ser apenas uma execução e passou a ser uma evolução contínua."

    }

  ];


  function updateProcess(index) {

    const data =
      processData[index];

    if (
      !data ||
      !processPanel
    ) {
      return;
    }


    $(".panel-category", processPanel)
      .textContent =
      data.category;


    $("h3", processPanel)
      .textContent =
      data.title;


    $("p", processPanel)
      .textContent =
      data.text;


    $(".process-icon", processPanel)
      .textContent =
      String(index + 1)
        .padStart(2, "0");


    timelineSteps.forEach(
      (step, stepIndex) => {

        step.classList.toggle(
          "active",
          stepIndex === index
        );

      }
    );

  }


  timelineSteps.forEach(
    step => {

      step.addEventListener(
        "click",
        () => {

          updateProcess(
            Number(
              step.dataset.step
            )
          );

        }
      );

    }
  );


  /* ========================================
     CONTADORES
  ======================================== */

  const discoveryOne =
    $("#discoveryOne");

  const discoveryTwo =
    $("#discoveryTwo");

  const countOne =
    $("#countOne");

  const countTwo =
    $("#countTwo");


  function updateCounter(
    field,
    counter
  ) {

    if (
      !field ||
      !counter
    ) {
      return;
    }


    counter.textContent =
      `${field.value.length}/${field.maxLength}`;

  }


  discoveryOne?.addEventListener(
    "input",
    () =>
      updateCounter(
        discoveryOne,
        countOne
      )
  );


  discoveryTwo?.addEventListener(
    "input",
    () =>
      updateCounter(
        discoveryTwo,
        countTwo
      )
  );


  /* ========================================
     FORMULÁRIO
  ======================================== */

  const reflectionForm =
    $("#reflectionForm");

  const clearButton =
    $("#clearButton");

  const saveMessage =
    $("#saveMessage");


  const STORAGE_KEY =
    "projetolab-reflexoes";


  function showMessage(
    message,
    error = false
  ) {

    if (!saveMessage) {
      return;
    }


    saveMessage.textContent =
      message;


    saveMessage.style.color =
      error
        ? "#ff4fd8"
        : "";


    clearTimeout(
      showMessage.timer
    );


    showMessage.timer =
      setTimeout(
        () => {

          saveMessage.textContent =
            "";

        },
        4000
      );

  }


  function loadReflections() {

    try {

      const saved =
        JSON.parse(
          localStorage.getItem(
            STORAGE_KEY
          ) || "null"
        );


      if (saved) {

        if (
          typeof saved.one
          === "string"
        ) {

          discoveryOne.value =
            saved.one;

        }


        if (
          typeof saved.two
          === "string"
        ) {

          discoveryTwo.value =
            saved.two;

        }

      }

    } catch (error) {

      console.warn(
        "Não foi possível carregar as reflexões.",
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


  reflectionForm?.addEventListener(
    "submit",
    event => {

      event.preventDefault();


      if (
        !reflectionForm.checkValidity()
      ) {

        reflectionForm.reportValidity();

        showMessage(
          "Preencha as duas descobertas antes de salvar.",
          true
        );

        return;

      }


      try {

        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({

            one:
              discoveryOne.value.trim(),

            two:
              discoveryTwo.value.trim(),

            savedAt:
              new Date().toISOString()

          })
        );


        showMessage(
          "✓ Reflexões salvas neste navegador."
        );

      } catch (error) {

        console.error(error);

        showMessage(
          "Não foi possível salvar as reflexões.",
          true
        );

      }

    }
  );


  clearButton?.addEventListener(
    "click",
    () => {

      discoveryOne.value =
        "";

      discoveryTwo.value =
        "";


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

        console.warn(error);

      }


      showMessage(
        "Reflexões apagadas."
      );

    }
  );


  /* ========================================
     TECLADO
  ======================================== */

  document.addEventListener(
    "keydown",
    event => {

      if (
        event.key === "Escape"
      ) {

        closeModal();

        closeMobileMenu();

      }

    }
  );


  /* ========================================
     INICIALIZAÇÃO
  ======================================== */

  updateProcess(0);

  loadReflections();

})();

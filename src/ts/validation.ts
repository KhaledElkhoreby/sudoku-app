// form submissions if there are invalid fields
export default (function () {
  'use strict';

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms =
    document.querySelectorAll<HTMLFormElement>('.needs-validation')!;

  // Loop over them and prevent submission
  [...forms].forEach((form) => {
    form.addEventListener(
      'submit',
      (event: Event) => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }

        form.classList.add('was-validated');
      },
      false
    );
  });
})();

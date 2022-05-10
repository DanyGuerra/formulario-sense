const HOST = location.protocol + "//" + location.host;
const btn_Send = document.getElementById("btn-download");
const nombre = document.getElementById("nombre");
const correo = document.getElementById("correo");
const telefono = document.getElementById("telefono");
const empresa = document.getElementById("empresa");
const inputs = [nombre, correo, telefono, empresa];

btn_Send.addEventListener("click", async (e) => {
  e.preventDefault();

  const errors = allValidation(inputs);

  if (errors.includes(false)) {
    return;
  } else {
    btn_Send.disabled = true;
    try {
      const sendInformation = await fetch("/", {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          correo: correo.value.trim(),
          nombre: nombre.value.trim(),
          telefono: telefono.value.trim(),
          empresa: empresa.value.trim(),
        }),
      });

      if (sendInformation.ok) {
        const res = await fetch("download");
        const data = await res.blob();
        const filename = "example.txt";
        var a = document.createElement("a");
        a.href = window.URL.createObjectURL(data);
        a.download = filename;
        a.click();
        if (res.ok) {
          window.location.href = `${HOST}/exito`;
        }
      } else {
      }
    } catch (error) {
      console.error(error);
    }
  }
});

inputs.forEach((input) => {
  input.addEventListener("blur", function () {
    formValidation(input);
  });
});

function allValidation(array) {
  let errors = array.map((input) => {
    return formValidation(input);
  });
  return errors;
}

function formValidation(input) {
  const value = input.value.trim();
  let isValid = false;

  if (value === "" || null) {
    setErrorFor(input, `${input.getAttribute("placeholder")} is required`);
  } else {
    const minLength = input.getAttribute("minlength");
    const maxLength = input.getAttribute("maxLength");
    const size = input.getAttribute("size");
    switch (input.getAttribute("type")) {
      case "text":
        setSuccessFor(input);
        isValid = true;
        break;
      case "password":
        if (minLength && value.length < minLength) {
          setErrorFor(
            input,
            `${input.getAttribute(
              "placeholder"
            )} length must be at least ${minLength}`
          );
        } else if (size && value.length != Number(size)) {
          setErrorFor(
            input,
            `${input.getAttribute("placeholder")} length must be ${size}`
          );
        } else {
          setSuccessFor(input);
          isValid = true;
        }
        break;
      case "tel":
        if (!isNumberValid(value)) {
          setErrorFor(
            input,
            `${input.getAttribute("placeholder")} must be a number`
          );
        } else if (minLength && value.length < minLength) {
          setErrorFor(
            input,
            `${input.getAttribute(
              "placeholder"
            )} length must be at least ${minLength}`
          );
        } else if (size && value.length != Number(size)) {
          setErrorFor(
            input,
            `${input.getAttribute("placeholder")} length must be ${size}`
          );
        } else {
          setSuccessFor(input);
          isValid = true;
        }
        break;
      case "email":
        if (!isEmail(value)) {
          setErrorFor(
            input,
            `${input.getAttribute("placeholder")} is not valid`
          );
        } else {
          setSuccessFor(input);
          isValid = true;
        }
        break;
      default:
        break;
    }
  }

  return isValid;
}

function isEmail(email) {
  return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    email
  );
}

function isNumberValid(number) {
  const regex = /^[0-9]*$/;
  return regex.test(number);
}

function setErrorFor(input, message) {
  const formControl = input.parentElement;
  const small = formControl.querySelector("small");
  formControl.className = "form-control error";
  small.innerText = message;
}

function setSuccessFor(input) {
  const formControl = input.parentElement;
  formControl.className = "form-control success";
}

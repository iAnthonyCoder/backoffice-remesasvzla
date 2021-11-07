import Swal from "sweetalert2"
import toastr from "toastr"
import "toastr/build/toastr.min.css"

const showNotifications = ({title, message, type, position='toast-top-right'}) => {

  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 5000,
    timerProgressBar: true,
    onOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
    },
  })

  Toast.fire({
    icon: type,
    title: title,
    message: message
  })

    // let toastType = type
    // const ele = document.getElementsByName("toastType");
    // //Close Button
    // const closeButton = true

    // //Debug
    // const debug = false

    // //Progressbar
    // const progressBar = false

    // //Duplicates
    // const preventDuplicates = true

    // //Newest on Top
    // const newestOnTop = true

    // //position class
    // let positionClass = "toast-top-right"

    // //Fetch position
    // for (let p = 0; p < position.length; p++) {
    //   positionClass = 'toast-top-right'
    // }

    // //Show Easing
    // const showEasing = 'swing'

    // //Hide Easing
    // const hideEasing = 'linear'

    // //show method
    // const showMethod = 'fadeIn'

    // //Hide method
    // const hideMethod = 'fadeOut'

    // //show duration
    // const showDuration = 300

    // //Hide duration
    // const hideDuration = 1000

    // //timeout
    // const timeOut = 5000

    // //extended timeout
    // const extendedTimeOut = 1000

    // //Fetch checked Type
    // for (let i = 0; i < ele.length; i++) {
    //   toastType = type
    // }

    // toastr.options = {
    //   positionClass: positionClass,
    //   timeOut: timeOut,
    //   extendedTimeOut: extendedTimeOut,
    //   closeButton: closeButton,
    //   debug: debug,
    //   progressBar: progressBar,
    //   preventDuplicates: preventDuplicates,
    //   newestOnTop: newestOnTop,
    //   showEasing: showEasing,
    //   hideEasing: hideEasing,
    //   showMethod: showMethod,
    //   hideMethod: hideMethod,
    //   showDuration: showDuration,
    //   hideDuration: hideDuration
    // }

    // // setTimeout(() => toastr.success(`Settings updated `), 300)
    // //Toaster Types
    // if (toastType === "info") toastr.info(message, title)
    // else if (toastType === "warning") toastr.warning(message, title)
    // else if (toastType === "error") toastr.error(message, title)
    // else toastr.success(message, title)
}

export default showNotifications
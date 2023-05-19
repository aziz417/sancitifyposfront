import Swal from 'sweetalert2';

export const successMessage = (text) => {
  return Swal.fire({
    title: 'Success!',
    text,
    icon: 'success',
  });
};

export const errorMessage = (text) => {
  return Swal.fire({
    title: 'Error!',
    text,
    icon: 'error',
  });
};

export const confirmMessage = (text, confirmButtonText) => {
  return Swal.fire({
    title: 'Are you sure?',
    text,
    icon: 'warning',
    confirmButtonText,
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
  });
};

export const confirmDelete = (
  message = "You won't be able to revert this!"
) => {
  return Swal.fire({
    title: 'Are you sure?',
    text: message,
    icon: 'warning',
    confirmButtonText: 'Yes, delete it!',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
  });
};

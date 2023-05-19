export default function ({ $axios, redirect, store }) {
  $axios.onRequest((config) => {
    // config.headers.common['X-Requested-With'] = 'XMLHttpRequest';
    // console.log('Making request to ' + config.url);
  });

  $axios.onResponse((response) => {
    // console.log('onResponse ' + response);
  });

  $axios.onError((error) => {
    const code = parseInt(error.response && error.response.status);
    // token mismatch
    if (code === 419) {
      // store.commit('auth/SET_LOGGED_OUT');
      redirect('/auth/login');
    }
    if (code === 400) {
      redirect('/400');
    }
    if (code === 401) {
      redirect('/auth/login');
    }
    if (error === 404) {
      redirect('/404');
    }
    if (code === 500) {
      redirect('/500');
    }
  });

  // $axios.onRequestError(error => {
  // console.log('onRequestError ' + error);
  // });

  // $axios.onResponseError(error => {
  // console.log('onResponseError ' + error);
  // store.commit('APP_NETWORK_ERROR', error);
  // });
}

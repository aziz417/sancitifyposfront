import Vue from 'vue';
export default ({ $auth }) => {
  const user = $auth.user;
  const permissions = (user && user.permissions) || [];

  Vue.directive('can', (el, binding, vnode) => {
    const behaviour = binding.modifiers.disable ? 'disable' : 'hide';
    let hasPermission = false;
    if (Array.isArray(binding.value)) {
      binding.value.forEach((permission) => {
        if (permissions.includes(permission)) {
          hasPermission = permissions.includes(permission);
        }
      });
    } else {
      hasPermission = permissions.includes(binding.value);
    }

    if (!hasPermission) {
      if (behaviour === 'hide') {
        commentNode(el, vnode);
      } else if (behaviour === 'disable') {
        el.disabled = true;
      }
    }
  });
};

/**
 * Create comment node
 *
 */
function commentNode(el, vnode) {
  const comment = document.createComment(' ');

  Object.defineProperty(comment, 'setAttribute', {
    value: () => undefined,
  });

  vnode.text = ' ';
  vnode.elm = comment;
  vnode.isComment = true;
  vnode.context = undefined;
  vnode.tag = undefined;
  vnode.data.directives = undefined;

  if (vnode.componentInstance) {
    vnode.componentInstance.$el = comment;
  }

  if (el.parentNode) {
    el.parentNode.replaceChild(comment, el);
  }
}

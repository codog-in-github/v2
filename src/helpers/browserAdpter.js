export const onBeforeUnload = navigator?.userAgent.includes('iPhone')
  ? function(cb) {
    window.addEventListener('beforeunload', cb);
  }
  : function(cb) {
    window.addEventListener('pagehide', cb);
  };

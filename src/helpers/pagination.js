import { reactive } from 'vue';

export function usePagination(options = {}) {
  const {
    dataHook = () => {}
  } = options;
  const paginate = reactive({
    page:     1,
    perPage:  10,
    total:    0,
    lastPage: 0,
    loading:  false
  });
  function callHook(hook) {
    if (!hook) {
      return;
    }
    hook();
  }
  return {
    paginate,
    reset(hook) {
      paginate.page = 1;
      callHook(hook);
    },
    changeSize(size, hook) {
      paginate.perPage = size;
      paginate.page = 1;
      callHook(hook);
    },
    moveByPage(page, hook) {
      console.log('moveByPage', page, paginate);
      if (page > 0 && page <= paginate.lastPage) {
        paginate.page = page;
        callHook(hook);
      }
    },
    requestMiddleware(request, next) {
      paginate.loading = true;
      if(request.data) {
        request.data.page = paginate.page;
        request.data.perPage = paginate.perPage;
      } else {
        request.data = {
          page:    paginate.page,
          perPage: paginate.perPage
        };
      }
      return next(request);
    },
    responseMiddleware(response, next) {
      paginate.loading = false;
      if (response) {
        paginate.perPage = response.perPage;
        paginate.total = response.total;
        paginate.lastPage = response.lastPage;
        paginate.page = response.page;
      }
      dataHook(response);
      return next(response.data);
    }
  };
}

export function requestWithPagination(request, pagination) {
  return request
    .addRequestMiddleware(
      pagination.requestMiddleware, 0
    )
    .addResponseMiddleware(
      pagination.responseMiddleware
    );
}

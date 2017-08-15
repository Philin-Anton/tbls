function paginate(data, currentPage, pageSize) {
  data = data || [];
  currentPage = currentPage ? currentPage : 0;
  const amountOfPages = Math.ceil(data.length / pageSize);
  const startPage = currentPage < amountOfPages ? currentPage : ((amountOfPages - 1) <= 0 ) ?  0 : amountOfPages - 1;
  return {
    amountPages: amountOfPages,
    data: data.slice(startPage * pageSize, startPage * pageSize + pageSize),
    currentPage: startPage
  };
}

export default paginate;
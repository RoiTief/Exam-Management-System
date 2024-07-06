const history = {
  previousPath: '',
};

export const setPreviousPath = (path) => {
  history.previousPath = path;
};

export const getPreviousPath = () => history.previousPath;
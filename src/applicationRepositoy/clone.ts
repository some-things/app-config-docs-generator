import { git } from '../git';

export const clone = () => {
  git.clone(
    "https://github.com/mesosphere/kommander-applications.git",
    "./tmp"
  );
};

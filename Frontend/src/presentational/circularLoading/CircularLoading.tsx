import { CircularProgress } from "@mui/material";
import { useState, useEffect } from "react";
import "./CircularLoading.css";
interface ICircularLoadingProps {
  isLoading: boolean;
}

export const CircularLoading = (props: ICircularLoadingProps) => {
  const [progress, setProgress] = useState(0);
  function getNextProgressVal(currentProgress: number) {
    const increment = 10;
    if (currentProgress + increment > 100) return 0;
    else return currentProgress + increment;
  }
  useEffect(() => {
    setProgress(0);
  }, [props]);
  setTimeout(
    () =>
      setProgress((currentProgress) =>
        props.isLoading ? getNextProgressVal(currentProgress) : currentProgress
      ),
    900
  );
  return props.isLoading ? (
    <div className="loading">
      <CircularProgress
        color="success"
        className="spinner"
        size={120}
        variant="determinate"
        value={progress}
      ></CircularProgress>
    </div>
  ) : (
    <></>
  );
};

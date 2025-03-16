//Hooks
import { useState, useRef } from "react";
//Interfaces
import {
  DataModule,
  IBookingInfo,
  IPassengerData,
} from "./data module/dataModule";
//Presentational components
import { ErrorMessage } from "./presentational/errorMessage/ErrorMessage";
import { Form } from "./presentational/form/Form";
import { CircularLoading } from "./presentational/circularLoading/CircularLoading";
import { PNRStatus } from "./presentational/PNRStatus/PNRStatus";
//Styles
import "./App.css";

function App() {
  //State of the App
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isErrorMessageVisible, setIsErrorMessageVisible] =
    useState<boolean>(false);
  const [isFormVisible, setIsFormVisible] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [bookingInfo, setBookingInfo] = useState<IBookingInfo | null>(null);
  const [allPassengersData, setAllPassengersData] = useState<
    IPassengerData[] | null
  >(null);
  const [isDataVisible, setIsDataVisibe] = useState<boolean>(false);
  //Reference to the form
  const inputRef = useRef<HTMLInputElement>(null);

  function onClickChange() {
    inputRef.current?.focus();
    setIsDataVisibe(false);
  }

  const fetchAndSetAppData = async (PNR: string) => {
    setIsFormVisible(false);
    setIsDataVisibe(false);

    const dataModule = new DataModule();
    const [fetchedBookingInfo, fetchedAllPassengersData, fetchedErrorMessage] =
      await dataModule.getAppData(PNR);

    setBookingInfo(fetchedBookingInfo);
    setAllPassengersData(fetchedAllPassengersData);

    if (fetchedBookingInfo !== null) setIsDataVisibe(true);
    if (isErrorMessageNonEmpty(fetchedErrorMessage)) {
      setErrorMessage(fetchedErrorMessage);
      setIsErrorMessageVisible(true);
    }

    setIsFormVisible(true);
    setIsDataVisibe(!isErrorMessageNonEmpty(fetchedErrorMessage));
  };

  function isErrorMessageNonEmpty(errorMessage: string) {
    return errorMessage.length > 0;
  }

  async function onClickRetry() {
    setIsDataVisibe(false);
    setIsFormVisible(false);
    setIsLoading(true);
    await fetchAndSetAppData(bookingInfo!.PNR); //Only called when bookingInfo is not null
    setIsLoading(false);
  }

  const onDismissError = (): void => {
    setIsErrorMessageVisible(false);
  };

  async function onSubmitForm(inputValue: string) {
    setIsErrorMessageVisible(false);
    setIsLoading(true);
    await fetchAndSetAppData(inputValue);
    setIsLoading(false);
  }

  return (
    <div className="app">
      <ErrorMessage
        isErrorMessageVisible={isErrorMessageVisible}
        errorMessage={errorMessage}
        onDismissError={onDismissError}
      ></ErrorMessage>
      <h1 className="title">PNR Status</h1>
      <Form
        isFormVisible={isFormVisible}
        onSubmitForm={onSubmitForm}
        ref={inputRef}
      ></Form>
      <CircularLoading isLoading={isLoading}></CircularLoading>
      <PNRStatus
        bookingInfo={bookingInfo}
        allPassengersData={allPassengersData}
        isDataVisible={isDataVisible}
        onClickChange={onClickChange}
        onClickRetry={onClickRetry}
      ></PNRStatus>
    </div>
  );
}

export default App;

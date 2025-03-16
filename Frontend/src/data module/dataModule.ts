interface IDateOfJourney {
  day: string;
  date: number;
  month: string;
}

export interface IBookingInfo {
  PNR: string;
  trainNumber: string;
  trainName: string;
  sourceStation: string;
  startTime: string;
  destinationStation: string;
  endTime: string;
  dateOfJourney: IDateOfJourney;
  journeyClass: string;
  quota: string;
  chartStatus: string;
  isWL: boolean;
}

export interface IPassengerData {
  serialNumber: number;
  currentStatus: string;
  bookingStatus: string;
}

type IAppData = [IBookingInfo | null, IPassengerData[] | null, string];

export class DataModule {
  private readonly PNRDetailsBaseURL: string;
  private readonly stationNameBaseURL: string;
  private readonly emptyPNRErrorMessage: string;
  private readonly callFailedErrorMessage: string;
  private readonly invalidPNRErrorMessage: string;

  constructor() {
    this.PNRDetailsBaseURL =
      "https://decaptcha-pnr-backend.onrender.com/finpredict?pnrnumber=";
    this.stationNameBaseURL =
      "https://www.ixigo.com/action/content/trainstation?searchFor=trainstationsLatLon&anchor=false&value=";

    this.emptyPNRErrorMessage = "Please Enter Your PNR";
    this.callFailedErrorMessage =
      "Sorry, we are unable to process your request at the moment. Please try later";
    this.invalidPNRErrorMessage =
      "The PNR you have entererd is invalid. Please enter a valid PNR";
  }

  public async getAppData(PNR: string): Promise<IAppData> {
    const rawPNRData = await this.getPNRData(PNR);
    const bookingInfo = await this.getBookingInfo(rawPNRData);
    const allPassengersData = this.getAllPassengersData(rawPNRData);
    const errorMessage = rawPNRData.errorMessage ?? "";
    return [bookingInfo, allPassengersData, errorMessage];
  }

  private async getPNRData(PNR: string) {
    if (PNR.length === 0) {
      const emptyPNRResponse = this.getErrorResponse(this.emptyPNRErrorMessage);
      return emptyPNRResponse;
    }

    if (!this.isPNRValid(PNR)) {
      const invalidPNRResponse = this.getErrorResponse(
        this.invalidPNRErrorMessage
      );
      return invalidPNRResponse;
    }

    const PNRDetailsEndpoint = this.PNRDetailsBaseURL + PNR;

    try {
      const response = await fetch(PNRDetailsEndpoint);
      const PNRData = await response.json();
      return PNRData;
    } catch (error) {
      console.error(error);
      const callFailedResponse = this.getErrorResponse(
        this.callFailedErrorMessage
      );
      return callFailedResponse;
    }
  }

  private isPNRValid(PNR: string) {
    const isPNR10Digits = PNR.length === 10;
    if (!isPNR10Digits) return false;

    for (let i = 0; i < PNR.length; i++)
      if (!(PNR[i] >= "0" && PNR[i] <= "9")) return false;

    return true;
  }

  private getErrorResponse(error: string) {
    return {
      errorMessage: error,
    };
  }

  private async getBookingInfo(rawPNRData): Promise<IBookingInfo | null> {
    if (this.hasErrorMessage(rawPNRData)) return null;

    //Partial used for declaring empty object
    let bookingInfo: Partial<IBookingInfo> = {};
    bookingInfo = {
      PNR: rawPNRData.pnrNumber,
      trainNumber: rawPNRData.trainNumber,
      trainName: rawPNRData.trainName,
      sourceStation: await this.getStationName(rawPNRData.sourceStation),
      startTime: this.getTimeFromDateString(rawPNRData.arrivalDate),
      destinationStation: await this.getStationName(
        rawPNRData.destinationStation
      ),
      endTime: this.getTimeFromDateString(rawPNRData.dateOfJourney),
      dateOfJourney: this.getDateOfJourney(rawPNRData),
      journeyClass: rawPNRData.journeyClass,
      quota: rawPNRData.quota,
      chartStatus: rawPNRData.chartStatus,
      isWL: this.isWL(rawPNRData),
    };

    return bookingInfo as IBookingInfo;
  }

  private async getStationName(stationCode: string): Promise<string> {
    const stationNameEndPoint = this.stationNameBaseURL + stationCode;
    let stationName: string = "";

    try {
      //the API returns a list of suggested stations.
      //Result that matches exactly with the given stationCode is stored at 0th index.
      //The full stationName is stored at station.e
      const response = await fetch(stationNameEndPoint);
      const data = await response.json();
      stationName = data[0].e;
    } catch (error) {
      console.error(error);
      stationName = stationCode;
    }

    return stationName;
  }

  private hasErrorMessage(rawPNRData): boolean {
    return "errorMessage" in rawPNRData;
  }

  private isWL(rawPNRData): boolean {
    return rawPNRData.isWL === "Y";
  }

  private getAllPassengersData(rawPNRData): IPassengerData[] | null {
    if (this.hasErrorMessage(rawPNRData)) return null;

    const rawAllPassengersData = rawPNRData.passengerList;
    const allPassengersData: IPassengerData[] = [];

    for (const rawPassengerData of rawAllPassengersData) {
      const passengerData: IPassengerData = {
        serialNumber: rawPassengerData.passengerSerialNumber,
        bookingStatus: rawPassengerData.bookingStatusDetails,
        currentStatus: rawPassengerData.currentStatusDetails,
      };
      allPassengersData.push(passengerData);
    }

    return allPassengersData;
  }

  private getTimeFromDateString(dateString: string): string {
    const date = new Date(dateString);
    const timeInDisplayFormat =
      date.getHours().toString() + ":" + date.getMinutes().toString();
    return timeInDisplayFormat;
  }

  private getDateOfJourney(rawPNRData): IDateOfJourney {
    const dateString = rawPNRData.dateOfJourney;
    const date = new Date(dateString);
    const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const dayIndex = date.getDay() - 1;
    return {
      day: weekdays[dayIndex],
      date: date.getDate(),
      month: months[date.getMonth()],
    };
  }
}

//Interfaces
import { IBookingInfo } from "../../data module/dataModule";
//Icons
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
//Styles
import "./BookingInfoCard.css";

type IBookingInfoCardProps = Partial<IBookingInfo | null> & {
  onClickChange: () => void;
};

export function BookingInfoCard(props: IBookingInfoCardProps): JSX.Element {
  const trainInfo: string = props?.trainNumber + " - " + props?.trainName;

  return props ? (
    <div className="cardContainer">
      <div className="bookingInfoCard">
        <div className="cardHeader">
          <div className="PNR">PNR: {props.PNR}</div>
          <a onClick={props.onClickChange} className="changeLink">
            CHANGE
          </a>
        </div>
        <div className="trainInfo">{trainInfo}</div>
        <div className="sourceAndDestination">
          <div className="source">
            {props.sourceStation},{props.startTime}
          </div>
          <div className="arrowIcon">
            <ArrowForwardIcon></ArrowForwardIcon>
          </div>
          <div className="destination">
            {props.destinationStation},{props.endTime}
          </div>
        </div>
        <div className="cardFooter">
          {props.dateOfJourney?.day}, {props.dateOfJourney?.date}{" "}
          {props.dateOfJourney?.month} | {props.journeyClass} | {props.quota}
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
}

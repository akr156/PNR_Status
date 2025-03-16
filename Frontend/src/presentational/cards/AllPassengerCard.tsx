//Hooks
import { useState } from "react";
//Interfaces
import { IPassengerData } from "../../data module/dataModule";
//Icons
import ReplayIcon from "@mui/icons-material/Replay";
//MUI table utilities
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
//Styles
import "./AllPassengerCard.css";

interface IAllPassengerCardProps {
  allPassengersData: IPassengerData[] | null;
  chartStatus?: string;
  isWL?: boolean;
  onClickRetry: () => void;
}

export function AllPassengerCard(props: IAllPassengerCardProps): JSX.Element {
  const [lastFetchedTime, setLastFetchedTime] = useState(0);

  setTimeout(() => setLastFetchedTime(lastFetchedTime + 1), 60000);

  function getLastFetchedTimeString(lastFetchedTime: number) {
    if (lastFetchedTime === 0) return "just now";
    else if (lastFetchedTime === 1) return "1 minute ago";
    else return lastFetchedTime.toString() + " minutes ago";
  }

  return (
    <div className="cardContainer">
      <div className="allPassengerCard">
        <div className="cardHeader allPassengerCardHeader">
          <div className="passengerStatus">Passenger Status</div>
          <div className="chartStatus">
            <div className="status">{props.chartStatus ?? ""}</div>
            <div className="lastFetchedTime">
              {getLastFetchedTimeString(lastFetchedTime)}
            </div>
            <button onClick={props.onClickRetry} className="retryIcon">
              <ReplayIcon fontSize="small"></ReplayIcon>
            </button>
          </div>
        </div>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell className="columnName">S. No</TableCell>
                <TableCell className="columnName" align="right">
                  Current Status
                </TableCell>
                <TableCell className="columnName" align="right">
                  Booking Status
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {props.allPassengersData?.map((passengerData) => (
                <TableRow
                  key={passengerData.serialNumber}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {passengerData.serialNumber}
                  </TableCell>
                  <TableCell
                    className={props.isWL ? "red" : "green"}
                    align="right"
                  >
                    {passengerData.currentStatus}
                  </TableCell>
                  <TableCell align="right">
                    {passengerData.bookingStatus}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}

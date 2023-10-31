import {
  Button,
  Container,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import ProcessingIcon from "components/processingIcon";
import { useState } from "react";

const API_END_POINT = process.env.REACT_APP_API_END_POINT;

export default function Home() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState();
  const [spendAmount, setSpendAmount] = useState("");
  const [withdrawTo, setWithdrawTo] = useState("");
  const [activityList, setActivityList] = useState();

  const getEllipsisTxt = (str, n = 6) => {
    if (str) {
      return `${str.slice(0, n)}...${str.slice(str.length - n)}`;
    }
    return "";
  };

  const onEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const onSpendAmountChange = (event) => {
    setSpendAmount(event.target.value);
  };

  const onWithdrawToChange = (event) => {
    setWithdrawTo(event.target.value);
  };

  const loadUser = async () => {
    setLoading(true);
    setSpendAmount("");
    setWithdrawTo("");

    try {
      let response = await axios.get(API_END_POINT + "user/" + email);
      setUserInfo(response.data);

      response = await axios.get(API_END_POINT + "user/activity/" + email);
      setActivityList(response.data.balanceActivityList);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const spendBalance = async () => {
    setLoading(true);

    try {
      await axios.post(API_END_POINT + "user/spend", {
        email: email,
        amount: spendAmount,
      });

      loadUser();
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const earn = async () => {
    setLoading(true);

    try {
      await axios.post(API_END_POINT + "user/earn", {
        email: email,
        amount: spendAmount,
      });

      loadUser();
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const withdraw = async () => {
    setLoading(true);

    try {
      await axios.post(API_END_POINT + "user/withdraw", {
        email: email,
        amount: spendAmount,
        to: withdrawTo,
      });

      loadUser();
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ paddingTop: "80px", paddingBottom: "48px" }}>
      <h2>Ratic Wallet Test</h2>

      <Stack>
        <h3 style={{ marginBottom: "4px" }}>Load User By Ratic ID</h3>

        <Stack flexDirection="row" alignItems="center">
          <TextField
            sx={{ width: "100%" }}
            id="event-name-input"
            variant="outlined"
            value={email}
            onChange={onEmailChange}
          />

          <Button
            variant="outlined"
            disabled={loading}
            endIcon={loading ? <ProcessingIcon /> : null}
            onClick={loadUser}
            sx={{ marginLeft: "16px" }}
          >
            LOAD
          </Button>
        </Stack>

        {userInfo ? (
          <Stack>
            <h3 style={{ marginBottom: "4px" }}>User Info</h3>

            <Stack flexDirection="row" alignItems="center">
              <h4 style={{ marginBottom: "4px", marginTop: "4px" }}>
                Ratic ID:
              </h4>
              <Typography variant="body1" sx={{ marginLeft: "8px" }}>
                {userInfo.email}
              </Typography>
            </Stack>

            <Stack flexDirection="row" alignItems="center">
              <h4 style={{ marginBottom: "4px", marginTop: "4px" }}>
                Address:
              </h4>
              <Typography variant="body1" sx={{ marginLeft: "8px" }}>
                {userInfo.wallet}
              </Typography>
            </Stack>

            <Stack flexDirection="row" alignItems="center">
              <h4 style={{ marginBottom: "4px", marginTop: "4px" }}>
                Balance:
              </h4>
              <Typography variant="body1" sx={{ marginLeft: "8px" }}>
                {userInfo.balance} RTC
              </Typography>

              <TextField
                sx={{ marginLeft: "16px", width: "104px" }}
                id="event-name-input"
                variant="outlined"
                value={spendAmount}
                onChange={onSpendAmountChange}
                placeholder="Amount"
              />

              <Button
                variant="outlined"
                disabled={loading}
                endIcon={loading ? <ProcessingIcon /> : null}
                onClick={spendBalance}
                sx={{ marginLeft: "16px" }}
              >
                Spend
              </Button>
              <Button
                variant="outlined"
                disabled={loading}
                endIcon={loading ? <ProcessingIcon /> : null}
                onClick={earn}
                sx={{ marginLeft: "16px" }}
              >
                Earn
              </Button>
              <TextField
                sx={{ marginLeft: "16px", width: "120px" }}
                id="event-name-input"
                variant="outlined"
                value={withdrawTo}
                onChange={onWithdrawToChange}
                placeholder="To Address"
              />
              <Button
                variant="outlined"
                disabled={loading}
                endIcon={loading ? <ProcessingIcon /> : null}
                onClick={withdraw}
                sx={{ marginLeft: "16px" }}
              >
                Withdraw
              </Button>
            </Stack>

            <h3 style={{ marginBottom: "4px", marginTop: "32px" }}>
              Balance Activity History
            </h3>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Time</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>From</TableCell>
                    <TableCell>To</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Balance After</TableCell>
                    <TableCell>Tx Hash</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {!activityList || !activityList.length ? (
                    <TableRow>
                      <TableCell colSpan={7}>
                        <Typography variant="body1">
                          No activity found
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    activityList.map((activity, index) => {
                      return (
                        <TableRow hover key={activity.id}>
                          <TableCell>
                            {new Date(activity.time).toLocaleString()}
                          </TableCell>
                          <TableCell>
                            {activity.type === 0
                              ? "Deposit"
                              : activity.type === 1
                              ? "Earn"
                              : activity.type === 2
                              ? "Spend"
                              : activity.type === 3
                              ? "Withdraw"
                              : ""}
                          </TableCell>
                          <TableCell>
                            {getEllipsisTxt(activity.from, 4)}
                          </TableCell>
                          <TableCell>
                            {getEllipsisTxt(activity.to, 4)}
                          </TableCell>
                          <TableCell>{activity.amount}</TableCell>
                          <TableCell>{activity.balanceAfter}</TableCell>
                          <TableCell>
                            {activity.transactionHash ? (
                              <a
                                href={`https://mumbai.polygonscan.com/tx/${activity.transactionHash}`}
                                target="_blank"
                                rel="noreferrer"
                              >
                                Tx ID
                              </a>
                            ) : (
                              "-"
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Stack>
        ) : null}
      </Stack>
    </Container>
  );
}

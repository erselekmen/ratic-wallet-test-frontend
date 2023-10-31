import { Button, Container, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";
import ProcessingIcon from "components/processingIcon";
import axios from "axios";
import { AES, PBKDF2 } from "crypto-js";
import CryptoJS from "crypto-js";
import { Contract, providers, utils, Wallet } from "ethers";
import erc20abi from "config/abi/erc20";

const API_END_POINT = process.env.REACT_APP_API_END_POINT;

export default function RaticWalletTestV2() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [wallet, setWallet] = useState();
  const [walletMaticBalance, setWalletMaticBalance] = useState("");
  const [walletRaticBalance, setWalletRaticBalance] = useState("");

  const [maticAmount, setMaticAmount] = useState("");
  const [maticTo, setMaticTo] = useState("");
  const [raticAmount, setRaticAmount] = useState("");
  const [raticTo, setRaticTo] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const onEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const onPasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const onMaticAmountChange = (event) => {
    setMaticAmount(event.target.value);
  };

  const onMaticToChange = (event) => {
    setMaticTo(event.target.value);
  };

  const onRaticAmountChange = (event) => {
    setRaticAmount(event.target.value);
  };

  const onRaticToChange = (event) => {
    setRaticTo(event.target.value);
  };

  const loadUser = async () => {
    setLoading(true);
    setWallet(null);
    setErrorMessage("");

    try {
      let encWalletFile = localStorage.getItem(email);
      let walletSalt;

      if (encWalletFile) {
        let response = await axios.get(API_END_POINT + "user/v2/salt/" + email);

        walletSalt = response.data;
      } else {
        let response = await axios.post(API_END_POINT + "user/v2/create", {
          email: email,
          password: password,
        });

        encWalletFile = response.data.encWalletFile;
        walletSalt = response.data.salt;

        localStorage.setItem(email, encWalletFile);
      }

      if (encWalletFile && walletSalt) {
        const salt = CryptoJS.enc.Hex.parse(walletSalt.saltHex);
        const iv = CryptoJS.enc.Hex.parse(walletSalt.ivHex);

        var key = PBKDF2(walletSalt.password, salt, {
          keySize: 256 / 32,
          iterations: 1000,
          hasher: CryptoJS.algo.SHA512,
        });

        const decString = AES.decrypt(
          CryptoJS.enc.Base64.stringify(CryptoJS.enc.Hex.parse(encWalletFile)),
          key,
          { iv: iv }
        ).toString(CryptoJS.enc.Utf8);

        let walletTemp = Wallet.fromEncryptedJsonSync(decString, password);

        walletTemp = walletTemp.connect(
          new providers.JsonRpcProvider("https://rpc-mumbai.maticvigil.com/")
        );

        setWallet(walletTemp);

        setWalletMaticBalance(utils.formatEther(await walletTemp.getBalance()));

        const raticContract = new Contract(
          "0x0b42b720ac235a3537badbbe9cba3808ec1ab742",
          erc20abi,
          walletTemp
        );

        setWalletRaticBalance(
          utils.formatEther(await raticContract.balanceOf(walletTemp.address))
        );
      }
    } catch (err) {
      setErrorMessage(err.message || JSON.stringify(err));
    } finally {
      setLoading(false);
    }
  };

  const sendMatic = async () => {
    setLoading(true);

    await wallet.sendTransaction({
      to: maticTo,
      value: utils.parseEther(maticAmount),
    });

    setWalletMaticBalance(utils.formatEther(await wallet.getBalance()));

    setLoading(false);
  };

  const sendRatic = async () => {
    setLoading(true);

    const raticContract = new Contract(
      "0x0b42b720ac235a3537badbbe9cba3808ec1ab742",
      erc20abi,
      wallet
    );

    await raticContract.transfer(raticTo, utils.parseEther(raticAmount));

    setWalletRaticBalance(
      utils.formatEther(await raticContract.balanceOf(wallet.address))
    );

    setLoading(false);
  };

  return (
    <Container maxWidth="md" sx={{ paddingTop: "80px", paddingBottom: "48px" }}>
      <h2>Ratic Wallet Test V2</h2>

      <Stack>
        <h3 style={{ marginBottom: "4px" }}>Load User By Ratic ID</h3>

        <Stack flexDirection="row" alignItems="center">
          <TextField
            sx={{ width: "100%" }}
            id="event-name-input"
            variant="outlined"
            value={email}
            placeholder="User ID"
            onChange={onEmailChange}
          />

          <TextField
            sx={{ width: "100%", marginLeft: "8px" }}
            id="event-name-input"
            variant="outlined"
            value={password}
            placeholder="Password"
            onChange={onPasswordChange}
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

        {errorMessage ? (
          <Typography variant="body1" sx={{ color: "red", padding: "16px" }}>
            {errorMessage}
          </Typography>
        ) : null}

        {wallet && email ? (
          <Stack>
            <h3 style={{ marginBottom: "4px" }}>User Info</h3>

            <Stack flexDirection="row" alignItems="center">
              <h4 style={{ marginBottom: "4px", marginTop: "4px" }}>
                Ratic ID:
              </h4>
              <Typography variant="body1" sx={{ marginLeft: "8px" }}>
                {email}
              </Typography>
            </Stack>

            <Stack flexDirection="row" alignItems="center">
              <h4 style={{ marginBottom: "4px", marginTop: "4px" }}>
                Address:
              </h4>
              <Typography variant="body1" sx={{ marginLeft: "8px" }}>
                {wallet.address}
              </Typography>
            </Stack>

            <Stack flexDirection="row" alignItems="center">
              <h4 style={{ marginBottom: "4px", marginTop: "4px" }}>
                MATIC Balance:
              </h4>
              <Typography variant="body1" sx={{ marginLeft: "8px" }}>
                {walletMaticBalance}
              </Typography>

              <TextField
                sx={{ width: "200px", marginLeft: "8px" }}
                id="event-name-input"
                variant="outlined"
                value={maticAmount}
                placeholder="Amount"
                onChange={onMaticAmountChange}
              />

              <TextField
                sx={{ width: "200px", marginLeft: "8px" }}
                id="event-name-input"
                variant="outlined"
                value={maticTo}
                placeholder="To"
                onChange={onMaticToChange}
              />

              <Button
                variant="outlined"
                disabled={loading}
                endIcon={loading ? <ProcessingIcon /> : null}
                onClick={sendMatic}
                sx={{ marginLeft: "16px" }}
              >
                SEND
              </Button>
            </Stack>

            <Stack flexDirection="row" alignItems="center">
              <h4 style={{ marginBottom: "4px", marginTop: "4px" }}>
                RATIC Balance:
              </h4>
              <Typography variant="body1" sx={{ marginLeft: "8px" }}>
                {walletRaticBalance}
              </Typography>

              <TextField
                sx={{ width: "200px", marginLeft: "8px" }}
                id="event-name-input"
                variant="outlined"
                value={raticAmount}
                placeholder="Amount"
                onChange={onRaticAmountChange}
              />

              <TextField
                sx={{ width: "200px", marginLeft: "8px" }}
                id="event-name-input"
                variant="outlined"
                value={raticTo}
                placeholder="To"
                onChange={onRaticToChange}
              />

              <Button
                variant="outlined"
                disabled={loading}
                endIcon={loading ? <ProcessingIcon /> : null}
                onClick={sendRatic}
                sx={{ marginLeft: "16px" }}
              >
                SEND
              </Button>
            </Stack>
          </Stack>
        ) : null}
      </Stack>
    </Container>
  );
}

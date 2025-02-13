import { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  MenuItem,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import "./styles/currencySwap.scss";
import swapIcon from "./assets/99tech.jpg";

const API_URL = "https://interview.switcheo.com/prices.json";
const TOKEN_ICON_URL = "https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/";

interface TokenData {
  currency: string;
  price: number;
}

export default function CurrencySwap() {
  const [tokens, setTokens] = useState<TokenData[]>([]);
  const [fromToken, setFromToken] = useState<string | null>(null);
  const [toToken, setToToken] = useState<string | null>(null);
  const [amount, setAmount] = useState<string>("");
  const [convertedAmount, setConvertedAmount] = useState<string>("0");
  const [confirmOpen, setConfirmOpen] = useState<boolean>(false);
  const [successOpen, setSuccessOpen] = useState<boolean>(false);

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data: TokenData[]) => {
        const uniqueTokens = Object.values(
          data.reduce<{ [key: string]: TokenData }>((acc, token) => {
            acc[token.currency] = token;
            return acc;
          }, {})
        );
        setTokens(uniqueTokens);
      });
  }, []);

  useEffect(() => {
    if (fromToken && toToken && amount) {
      const fromPrice = tokens.find((t) => t.currency === fromToken)?.price;
      const toPrice = tokens.find((t) => t.currency === toToken)?.price;

      if (fromPrice && toPrice) {
        setConvertedAmount(((parseFloat(amount) * fromPrice) / toPrice).toFixed(6));
      } else {
        setConvertedAmount("0");
      }
    }
  }, [fromToken, toToken, amount, tokens]);

  // Swap fromToken and toToken
  const handleSwapTokens = () => {
    setFromToken(toToken);
    setToToken(fromToken);
  };

  // Open confirmation dialog
  const handleConfirmSwap = () => {
    setConfirmOpen(true);
  };

  // Handle swap confirmation
  const handleConfirm = () => {
    setConfirmOpen(false);
    setSuccessOpen(true);
    setAmount("");
    setFromToken(null);
    setToToken(null);
    setConvertedAmount("0");
  };

  return (
    <div className="swap-container">
      <Card className="swap-card">
        <CardContent>
          <Typography variant="h5" align="center" gutterBottom className="swap-title">
            <img src={swapIcon} alt="Swap Icon" className="swap-icon" />
          </Typography>
          <Typography variant="h5" align="center" gutterBottom className="swap-title">
            Swap
          </Typography>

          {/* Amount Input */}
          <TextField
            fullWidth
            label="Amount to send"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            margin="normal"
          />

          {/* From Token Select */}
          <Autocomplete
            options={tokens}
            getOptionLabel={(option) => option.currency}
            value={tokens.find((t) => t.currency === fromToken) || null}
            onChange={(_, newValue) => setFromToken(newValue?.currency || null)}
            renderInput={(params) => <TextField {...params} label="From Token" fullWidth margin="normal" />}
            renderOption={(props, option) => (
              <MenuItem {...props} key={option.currency} value={option.currency}>
                <img
                  src={`${TOKEN_ICON_URL}${option.currency}.svg`}
                  alt={option.currency}
                  width={20}
                  height={20}
                  style={{ marginRight: 8 }}
                />
                {option.currency}
              </MenuItem>
            )}
          />

          {/* Swap Button */}
          <div className="swap-button-container">
            <IconButton onClick={handleSwapTokens} className="swap-button">
              <SwapVertIcon fontSize="large" />
            </IconButton>
          </div>

          {/* To Token Select */}
          <Autocomplete
            options={tokens}
            getOptionLabel={(option) => option.currency}
            value={tokens.find((t) => t.currency === toToken) || null}
            onChange={(_, newValue) => setToToken(newValue?.currency || null)}
            renderInput={(params) => <TextField {...params} label="To Token" fullWidth margin="normal" />}
            renderOption={(props, option) => (
              <MenuItem {...props} key={option.currency} value={option.currency}>
                <img
                  src={`${TOKEN_ICON_URL}${option.currency}.svg`}
                  alt={option.currency}
                  width={20}
                  height={20}
                  style={{ marginRight: 8 }}
                />
                {option.currency}
              </MenuItem>
            )}
          />

          {/* Converted Amount */}
          <TextField
            fullWidth
            label="Amount to receive"
            value={convertedAmount}
            margin="normal"
            InputProps={{ readOnly: true }}
          />

          {/* Confirm Swap Button */}
          <Button
            fullWidth
            variant="contained"
            color="primary"
            disabled={!amount || !fromToken || !toToken}
            sx={{ marginTop: 2 }}
            onClick={handleConfirmSwap}
          >
            CONFIRM SWAP
          </Button>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Confirm Swap</DialogTitle>
        <DialogContent>
          <Typography>
            Swap {amount} {fromToken} to {convertedAmount} {toToken}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleConfirm} color="primary" variant="contained">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Notification */}
      <Snackbar open={successOpen} autoHideDuration={3000} onClose={() => setSuccessOpen(false)}>
        <Alert onClose={() => setSuccessOpen(false)} severity="success" variant="filled">
          Swap Successful!
        </Alert>
      </Snackbar>
    </div>
  );
}

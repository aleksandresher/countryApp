import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import styled from "styled-components";
import Select from "react-select";

function CurrecnyExchange({ countries }) {
  const currency = useSelector((state) => state.currency.selectedCurrency);
  const symbol = useSelector((state) => state.currency.selectedCurrencySymbol);
  const [transferMoneySymbol, setTransferMoneySymbol] = useState("");
  const [rate, setRate] = useState(null);
  const [amount, setAmount] = useState(0);
  const [transferedMoney, setTransferedMoney] = useState(0);
  const [singleCountry, setSingleCountry] = useState("");
  const [transCurrency, setTransCurrency] = useState("");
  const [selectedCountry, setSelectedCountry] = useState();

  useEffect(() => {
    fetch(`https://api.exchangerate.host/latest?base=${currency}`)
      .then((res) => {
        if (res.status !== 200) {
          throw new Error("Failed to fetch status");
        }
        return res.json();
      })
      .then((resData) => {
        setRate(resData);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [currency]);

  useEffect(() => {
    if (amount && selectedCountry) {
      setTransferedMoney(amount * (rate?.rates[transCurrency] || 0));
    }
  }, [amount, transCurrency, singleCountry]);

  const countryValues = countries
    ?.map((item) => ({
      value: item?.value,
      label: item?.value,
    }))
    .sort((a, b) => {
      return a.label.localeCompare(b.label, undefined, { sensitivity: "base" });
    });

  function handleCountryChange(selectedOption) {
    setSelectedCountry(selectedOption.value);
  }

  useEffect(() => {
    if (selectedCountry) {
      fetch(`https://restcountries.com/v3.1/name/${selectedCountry}`)
        .then((res) => {
          if (res.status !== 200) {
            throw new Error("Failed to fetch status");
          }
          return res.json();
        })
        .then((resData) => {
          setSingleCountry(resData[0]);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [selectedCountry]);

  useEffect(() => {
    if (selectedCountry) {
      for (const key in singleCountry.currencies) {
        if (singleCountry.currencies.hasOwnProperty(key)) {
          setTransferMoneySymbol(singleCountry.currencies[key].symbol);
          setTransCurrency(key);
          break;
        }
      }
    }
  }, [selectedCountry, singleCountry]);

  return (
    <CurrencyWrapper>
      <CurrencyHeading>Currency Exchange</CurrencyHeading>
      <ReactSelect
        options={countryValues}
        value={selectedCountry}
        onChange={handleCountryChange}
        placeholder={selectedCountry}
        isClearable
        isSearchable
        menuPlacement="auto"
      />
      <CalculationWrapper>
        <InputContainer amount={amount}>
          <p>{symbol}</p>
          <MoneyInput
            type="number"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
          />
        </InputContainer>
        <EqualSign>=</EqualSign>
        <OutputContainer>
          <p>{transferMoneySymbol}</p>
          <p>{transferedMoney}</p>
        </OutputContainer>
      </CalculationWrapper>
    </CurrencyWrapper>
  );
}
export default CurrecnyExchange;

const CurrencyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: flex-start;
  margin-top: 30px;
  padding: 16px;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 2px 1px -1px,
    rgba(0, 0, 0, 0.14) 0px 1px 1px 0px, rgba(0, 0, 0, 0.12) 0px 1px 3px 0px;
`;

const ReactSelect = styled(Select)`
  width: 20%;
`;
const CurrencyHeading = styled.h1`
  font-size: 30px;
  font-weight: 400;
  font-family: "Roboto", sans-serif;
`;

const CalculationWrapper = styled.div`
  display: flex;
  width: 100%;
  gap: 10px;
  align-items: Center;
`;
const InputContainer = styled.div`
  width: 50%;
  display: flex;
  gap: 4px;
  border-bottom: ${(props) =>
    props.amount ? "1px solid #1976D2" : "1px solid #000"};
`;

const MoneyInput = styled.input`
  border: none;
  outline: none;
  width: 100%;
  padding: 2px;
  font-family: "Roboto", sans-serif;
`;

const OutputContainer = styled.div`
display:flex;
gap:4px;
  width: 50%;
  outline: none;
  border-bottom: 1px dotted #000; /
  border-top: none; 
  border-left: none; 
  border-right: none; 
  padding: 2px;
`;

const EqualSign = styled.p`
  font-size: 30px;
  font-weight: 700;
  font-family: "Roboto", sans-serif;
`;

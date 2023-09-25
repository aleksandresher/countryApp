import { useEffect, useState } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { setCurrency } from "../feaures/CurrencySlice";
import { setCountryInfo } from "../feaures/CountryInfoSlice";
function SingleCountry({ allCountries }) {
  const [singleCountry, setSingleCountry] = useState("");
  const [localCurrency, setLocalCurrency] = useState("");
  const [symbol, setSymbol] = useState("");
  const dispatch = useDispatch();
  const country = useSelector((state) => state.country);
  useEffect(() => {
    if (country) {
      fetch(`https://restcountries.com/v3.1/name/${country}`)
        .then((res) => {
          if (res.status !== 200) {
            throw new Error("Failed to fetch status");
          }
          return res.json();
        })
        .then((resData) => {
          setSingleCountry(resData[0]);
          dispatch(setCountryInfo(resData[0]));
          // console.log(resData[0]);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [country]);

  useEffect(() => {
    let currencyName = "";
    let symbol = "";
    if (singleCountry && singleCountry.currencies) {
      for (const key in singleCountry.currencies) {
        if (singleCountry.currencies.hasOwnProperty(key)) {
          currencyName = singleCountry.currencies[key].name;
          symbol = singleCountry.currencies[key].symbol;
          setSymbol(symbol);
          setLocalCurrency(currencyName);
          dispatch(setCurrency({ currency: key, symbol: symbol }));
          break;
        }
      }
    }
  }, [singleCountry]);

  function formatNumber(number) {
    return number?.toLocaleString() || "";
  }
  const matchedCountries = allCountries.filter((country) =>
    singleCountry?.borders?.some((border) => border === country.cca3)
  );
  const borderCountries = matchedCountries
    .map((obj) => obj.name.common)
    .join(", ");

  return (
    <Wrapper>
      <NameAndFlag>
        <CountryName>{singleCountry?.name?.official}</CountryName>
        <Flag src={singleCountry?.flags?.png} alt="countryFlag" />
      </NameAndFlag>

      <InfoContainer>
        <Box>
          <InfoKeys>Capital:</InfoKeys>
          <InfoText>{singleCountry?.capital}</InfoText>
        </Box>
        <Box>
          <InfoKeys>Continent:</InfoKeys>
          <InfoText>{singleCountry?.continents}</InfoText>
        </Box>

        <Box>
          <InfoKeys>Currency:</InfoKeys>
          <InfoText>
            {localCurrency} {symbol}
          </InfoText>
        </Box>

        <Box>
          <InfoKeys>Population:</InfoKeys>
          <InfoText>{formatNumber(singleCountry?.population)}</InfoText>
        </Box>
        <Box>
          <InfoKeys>Region:</InfoKeys>
          <InfoText>
            {singleCountry?.region}, {singleCountry?.subregion}
          </InfoText>
        </Box>
        <Box>
          <InfoKeys>Borders:</InfoKeys>
          <InfoText>{borderCountries}</InfoText>
        </Box>
      </InfoContainer>
    </Wrapper>
  );
}

export default SingleCountry;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #fff;
  border-radius: 4px;
  margin-top: 20px;
  padding: 16px;
  color: #000;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 2px 1px -1px,
    rgba(0, 0, 0, 0.14) 0px 1px 1px 0px, rgba(0, 0, 0, 0.12) 0px 1px 3px 0px;
`;

const InfoContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: 100%;
`;

const NameAndFlag = styled.div`
  display: flex;
  padding: 8px;
  align-items: center;
  gap: 20px;
`;

const CountryName = styled.h1`
  font-size: 40px;
  font-family: "Roboto", sans-serif;
  font-weight: 400;
`;

const InfoKeys = styled.p`
  font-size: 20px;
  font-weight: 600;
  letter-spacing: 1.5;
  font-family: "Roboto", sans-serif;
`;

const InfoText = styled.p`
  font-size: 18px;
  letter-spacing: 1.5;
  font-family: "Roboto", sans-serif;
`;

const Box = styled.div`
  display: flex;
  gap: 20px;
  padding: 8px;
  width: 100%;
`;
const Flag = styled.img`
  width: auto;
  height: 30px;
`;

import { useEffect, useState } from "react";
import SingleCountry from "./components/SingleCountry";
import CurrecnyExchange from "./components/CurrExchange";
import Select from "react-select";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { setCountryName } from "./feaures/CountrySlice";
import AirPort from "./components/Airports";

function App() {
  const [position, setPosition] = useState("");
  const dispatch = useDispatch();
  const [allCountries, setAllCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [currencyActive, setCurrencyActive] = useState(true);
  const [ariportActive, setAirportActive] = useState(false);

  const countryValues = allCountries
    ?.map((item) => ({
      value: item.name.common,
      label: item.name.common,
    }))
    .sort((a, b) => {
      return a.label.localeCompare(b.label, undefined, { sensitivity: "base" });
    });

  function handleCountryChange(selectedOption) {
    setSelectedCountry(selectedOption.value);
    dispatch(setCountryName(selectedOption.value));
  }

  const geoKey = process.env.REACT_APP_API_TOKEN;
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        function (position) {
          setPosition(position.coords);
        },
        function (error) {
          console.error(error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, [allCountries]);

  useEffect(() => {
    dispatch(setCountryName(selectedCountry));
    setCurrencyActive("true");
    setAirportActive("false");
  }, [selectedCountry, dispatch]);

  useEffect(() => {
    if (position) {
      fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${position.latitude},${position.longitude}&key=${geoKey}`
      )
        .then((res) => {
          if (res.status !== 200) {
            throw new Error("Failed to fetch status");
          }
          return res.json();
        })
        .then((resData) => {
          const compoundCode = resData.plus_code.compound_code;
          const parts = compoundCode.split(" ");
          setSelectedCountry(parts[2]);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [position, geoKey]);

  useEffect(() => {
    fetch(`https://restcountries.com/v3.1/all?fields=name,cca3`)
      .then((res) => {
        if (res.status !== 200) {
          throw new Error("Failed to fetch status");
        }
        return res.json();
      })
      .then((resData) => {
        setAllCountries(resData);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  function changeCurrecnyToAirport() {
    setAirportActive(true);
    setCurrencyActive(false);
  }
  function changeAirportToCurrecny() {
    setCurrencyActive(true);
    setAirportActive(false);
  }

  return (
    <HomeWrapper>
      <HomeContainer>
        <div>
          <ReactSelect
            options={countryValues}
            value={selectedCountry}
            onChange={handleCountryChange}
            placeholder={selectedCountry}
            isClearable
            isSearchable
            menuPlacement="auto"
          />
          <SingleCountry allCountries={allCountries} />
          <BtnWrapper>
            <Btn1
              onClick={() => changeAirportToCurrecny()}
              show={currencyActive}
            >
              Currency exchange
            </Btn1>
            <Btn2
              onClick={() => changeCurrecnyToAirport()}
              show={ariportActive}
            >
              airports
            </Btn2>
          </BtnWrapper>
          {currencyActive ? (
            <CurrecnyExchange countries={countryValues} />
          ) : (
            <AirPort />
          )}
        </div>
      </HomeContainer>
    </HomeWrapper>
  );
}

export default App;

const HomeWrapper = styled.div`
  display: flex;
  padding-top: 20px;
  align-items: center;
  flex-direction: column;
`;

const HomeContainer = styled.div`
  width: 80%;
  border: 1px solid #ccc;
  padding: 20px;
`;

const ReactSelect = styled(Select)`
  width: 100%;
  font-size: 20px;
  color: #000;
`;
const BtnWrapper = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 30px;
`;
const Btn1 = styled.button`
  border: none;
  font-family: "Roboto", sans-serif;

  text-transform: uppercase;
  font-size: 20px;
  background: none;
  font-weight: 400;
  cursor: pointer;
  color: ${(props) => (props.show === "true" ? "#1976D2" : "#000")};
`;

const Btn2 = styled.a`
  border: none;
  font-family: "Roboto", sans-serif;
  font-size: 20px;
  text-transform: uppercase;
  background: none;
  font-weight: 400;
  cursor: pointer;
  color: ${(props) => (props.show === "true" ? "#1976D2" : "#000")};
`;

import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { RotatingLines } from "react-loader-spinner";
import { setAirportData } from "../feaures/CacheSlice";

function AirPort() {
  const country = useSelector((state) => state.country);
  const cachedData = useSelector((state) => state.airportData.cachedData);
  const countryData = useSelector((state) => state.countryInfo);
  const [airport, setAirport] = useState("");
  const [airports, setAirports] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    if (country) {
      const cachedDataForCountry = cachedData[country];
      if (cachedDataForCountry) {
        setAirports(cachedDataForCountry);
      } else {
        const apiKey = process.env.REACT_APP_AIRPORT_KEY;
        const apiUrl = `https://api.api-ninjas.com/v1/airports?country=${countryData.cca2}`;

        fetch(apiUrl, {
          method: "GET",
          headers: {
            "X-Api-Key": apiKey,
            "Content-Type": "application/json",
          },
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            return response.json();
          })
          .then((data) => {
            setAirports(data);
            dispatch(
              setAirportData({
                country: countryData?.name?.common,
                data: data,
              })
            );
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      }
    }
  }, [country, countryData]);

  useEffect(() => {
    let debounceTimer;
    debounceTimer = setTimeout(() => {
      searchAirports(airport);
    }, 500);

    return () => {
      clearTimeout(debounceTimer);
    };
  }, [airport]);

  const searchAirports = (searchTerm) => {
    if (searchTerm.trim() === "") {
      return;
    }
    const filtered = airports.filter((airportItem) =>
      airportItem.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setAirports(filtered);
  };

  const handleSearchInputChange = (e) => {
    const newAirportValue = e.target.value;
    setAirport(newAirportValue);
  };

  return (
    <AirportsWrapper>
      <AirportHeading>Airports</AirportHeading>
      <SearchInput
        type="text"
        value={airport}
        onChange={handleSearchInputChange}
        placeholder="Search airports"
      />
      <AirportsContainer>
        {airports.length > 0 ? (
          airports?.map((item) => (
            <AirportWrapper key={item.icao}>
              <AirportIcao>{item.icao}</AirportIcao>
              <p>-</p>
              <AirportName>{item.name}</AirportName>
            </AirportWrapper>
          ))
        ) : (
          <RotatingLines
            strokeColor="grey"
            strokeWidth="5"
            animationDuration="0.75"
            width="96"
            visible={true}
          />
        )}
      </AirportsContainer>
    </AirportsWrapper>
  );
}
export default AirPort;

const AirportsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 20px;

  box-shadow: rgba(0, 0, 0, 0.2) 0px 2px 1px -1px,
    rgba(0, 0, 0, 0.14) 0px 1px 1px 0px, rgba(0, 0, 0, 0.12) 0px 1px 3px 0px;
  padding: 16px;
`;

const AirportsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
`;
const AirportWrapper = styled.div`
  display: flex;
  gap: 10px;
  padding: 5px;
`;

const SearchInput = styled.input`
  border: none;
  border-bottom: 2px solid #000;
  width: 30%;
  padding: 5px;
  font-family: "Roboto", sans-serif;

  &:focus {
    border-bottom: 2px solid #1976d2;
    outline: none;
  }
`;

const AirportHeading = styled.h1`
  font-size: 30px;
  font-weight: 400;
  font-family: "Roboto", sans-serif;
`;
const AirportIcao = styled.p`
  font-size: 16px;
  font-family: "Roboto", sans-serif;
`;
const AirportName = styled.p`
  font-size: 16px;
  font-family: "Roboto", sans-serif;
`;

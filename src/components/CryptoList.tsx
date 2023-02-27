import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Spinner, Toast, Container } from "react-bootstrap";
import { Link } from "react-router-dom";

interface Crypto {
  uuid: string;
  name: string;
  symbol: string;
  rank: number;
  price: number;
  change: number;
}

const CryptoList: React.FC = () => {
  const [data, setData] = useState<Crypto[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [errMessage, setErrMessage] = useState<string>("");

  useEffect(() => {
    setLoading(true);
    axios
      .get("https://api.coinranking.com/v2/coins?limit=10")
      .then((response) => {
        setData(response.data.data.coins);
        setLoading(false);
        setErrMessage("");
      })
      .catch((error) => {
        setLoading(false);
        setErrMessage(
          error.response?.data?.message ||
            "Something went wrong, try again later"
        );
      });
  }, []);

  return (
    <Container className="py-4">
      <Toast
        show={errMessage !== ""}
        onClose={() => setErrMessage("")}
        className="bg-danger text-white"
        delay={3000}
        autohide
      >
        <Toast.Body>{errMessage}</Toast.Body>
      </Toast>
      <h1 className="mb-4">Top Cryptocurrencies</h1>
      {loading ? (
        <div className="d-flex justify-content-center align-items-center">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Name</th>
              <th>Symbol</th>
              <th>Price</th>
              <th>24h Change</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {data.map((coin) => (
              <tr key={coin.uuid}>
                <td>{coin.rank}</td>
                <td>{coin.name}</td>
                <td>{coin.symbol}</td>
                <td>{coin.price}</td>
                <td>{coin.change}</td>
                <td>
                  <Button variant="primary">
                    <Link
                      to={`/crypto/${coin.uuid}/${coin.name}`}
                      className="text-white text-decoration-none"
                    >
                      View Details
                    </Link>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default CryptoList;

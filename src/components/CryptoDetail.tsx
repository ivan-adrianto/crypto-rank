import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { Spinner, Container, Toast } from "react-bootstrap";

interface Price {
  timestamp: number;
  price: number;
}

interface Params {
  uuid: string;
  name: string;
  [key: string]: string;
}

const CryptoDetail: React.FC = () => {
  const { uuid, name } = useParams<Params>();
  const [data, setData] = useState<{ history: Price[] } | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [errMessage, setErrMessage] = useState<string>("");

  useEffect(() => {
    setLoading(true);
    axios
      .get(
        `https://api.coinranking.com/v2/coin/${uuid}/history?coinranking34a7cb4234380ef84ce948211e1e71a51dd357e2952cc284&timePeriod=1y`
      )
      .then((result) => {
        setLoading(false);
        setData(result.data.data);
      })
      .catch((error) => {
        setLoading(false);
        setErrMessage(
          error.response?.data?.message ||
            "Something went wrong, try again later"
        );
      });
  }, [uuid]);

  const chartData = data?.history
    .slice(0, 30)
    .reverse()
    .map((price) => {
      const date = new Date(price.timestamp * 1000);
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear();
      const formattedDate = `${day}/${month}/${year}`;
      return {
        date: formattedDate,
        price: price.price,
      };
    });

  return (
    <Container className="py-4 d-flex flex-column align-items-center">
      <Toast
        show={errMessage !== ""}
        onClose={() => setErrMessage("")}
        className="bg-danger text-white"
        delay={3000}
        autohide
      >
        <Toast.Body>{errMessage}</Toast.Body>
      </Toast>
      <h2 className="mb-4">Historical Prices for {name}</h2>
      {loading ? (
        <div className="d-flex justify-content-center align-items-center" data-testid="loading">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <div data-testid="recharts-wrapper">
          <p className="mx-5 fw-bold mb-1">{"(in USD)"}</p>
          <LineChart
            width={800}
            height={400}
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <XAxis dataKey="date" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
              dot={false}
            />
          </LineChart>
        </div>
      )}
    </Container>
  );
};

export default CryptoDetail;

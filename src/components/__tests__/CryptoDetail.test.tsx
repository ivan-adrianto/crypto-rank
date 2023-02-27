import { render, screen, waitFor, act } from "@testing-library/react";
import axios from "axios";
import CryptoDetail from "../CryptoDetail";
import "@testing-library/jest-dom";

const mockAxiosGet = jest.fn();
axios.get = mockAxiosGet;

describe("CryptoDetail", () => {
  const mockData = {
    history: [
      { timestamp: 1677456000, price: 50000 },
      { timestamp: 1677369600, price: 55000 },
      { timestamp: 1677283200, price: 60000 },
    ],
  };

  beforeEach(() => {
    mockAxiosGet.mockReset();
  });

  it("should display error toast when data fetching fails", async () => {
    const errorMessage = "Network Error";
    mockAxiosGet.mockRejectedValue({
      response: { data: { message: errorMessage } },
    });
    await act(async () => {
      render(<CryptoDetail />);
    });
    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it("should display chart with data when data is fetched successfully", async () => {
    mockAxiosGet.mockResolvedValue({ data: { data: mockData } });
    await act(async () => {
      render(<CryptoDetail />);
    });
    await waitFor(() => {
      expect(screen.getByText("Historical Prices for")).toBeInTheDocument();
      expect(screen.getByText("(in USD)")).toBeInTheDocument();
      expect(screen.getByTestId("recharts-wrapper")).toBeInTheDocument();
      const elements = screen.getAllByText("26/02/2023")
      expect(elements.length).toBeLessThan(3)
    });
  });
});

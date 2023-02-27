import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import { MemoryRouter } from "react-router-dom";
import CryptoList from "../CryptoList";
import { act } from "react-dom/test-utils";
import "@testing-library/jest-dom";

const mockAxiosGet = jest.fn();
axios.get = mockAxiosGet;

describe("CryptoList", () => {
  const mockData = {
    data: {
      data: {
        coins: [
          {
            uuid: "1",
            name: "Bitcoin",
            symbol: "BTC",
            rank: 1,
            price: 50000,
            change: 10,
          },
          {
            uuid: "2",
            name: "Ethereum",
            symbol: "ETH",
            rank: 2,
            price: 2000,
            change: -5,
          },
        ],
      },
    },
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should display error toast when data fetching fails", async () => {
    const errorMessage = "Network Error";
    mockAxiosGet.mockRejectedValue({
      response: { data: { message: errorMessage } },
    });

    await act(async () => {
      render(
        <MemoryRouter initialEntries={["/"]}>
          <CryptoList />
        </MemoryRouter>
      );
    });

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it("should display table with data when data is fetched successfully", async () => {
    mockAxiosGet.mockResolvedValue(mockData);

    await act(async () => {
      render(
        <MemoryRouter initialEntries={["/"]}>
          <CryptoList />
        </MemoryRouter>
      );
    });

    await waitFor(() => {
      expect(screen.getByText("Name")).toBeInTheDocument();
      expect(screen.getByText("Bitcoin")).toBeInTheDocument();
      expect(screen.getByText("Ethereum")).toBeInTheDocument();
    });
  });
});

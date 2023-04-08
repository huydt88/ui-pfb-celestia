import React, { useState, useEffect } from "react";
import axios from "axios";
import logo from "./Celestia_logo.jpeg";
import { Button } from "antd";

const Hehe = () => {
  const [id, setId] = useState("");
  const [mes, setMes] = useState("");
  const [hight, setHigh] = useState("");
  const [txs, setTxs] = useState("");
  const [shares, setShares] = useState("");
  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [gasUse, setGasUse] = useState(0);
  const [fee, setFee] = useState(2000);
  const [gasLimit, setGasLimit] = useState(80000);

  useEffect(() => {
    if (hight) {
      getData(id, hight).then((res) => {
        setShares(res.data.shares);
        setValidated(true);
        setLoading(false);
      });
    }
  }, [hight]);

  const getGenData = async (mes) => {
    return await axios.post(`${process.env.REACT_APP_API}/genadata`, { mes });
  };

  const postData = async (namespace_id, data, gas_limit, fee) => {
    return await axios.post(`${process.env.REACT_APP_API}/submitpfb`, {
      namespace_id,
      data,
      gas_limit,
      fee,
    });
  };

  const getData = async (id, hight) => {
    return await axios.get(
      `${process.env.REACT_APP_API}/namespaced/${id}/hight/${hight}`
    );
  };

  const FormData = () => (
    <form onSubmit={handSub}>
      <div className="row">
        <div className="form-group col">
          <label>Message</label>
          <input
            type="text"
            className="form-control"
            value={mes}
            maxLength="100"
            placeholder="Write a message"
            required
            onChange={(e) => setMes(e.target.value)}
          />
        </div>

        <div className="form-group col">
          <label>ID</label>
          <input
            type="text"
            className="form-control"
            value={id}
            placeholder="Random your NamespaceID"
            onChange={(e) => setId(e.target.value)}
            readOnly
          />
        </div>
      </div>

      <div className="row">
        <div className="form-group col">
          <label>Gas Limit</label>
          <input
            type="number"
            className="form-control"
            value={gasLimit}
            maxLength="100"
            placeholder="Write gasLimit u want"
            required
            onChange={(e) => setGasLimit(e.target.value)}
          />
        </div>

        <div className="form-group col">
          <label>Fee</label>
          <input
            type="number"
            className="form-control"
            value={fee}
            placeholder="Write fee u want"
            required
            onChange={(e) => setFee(e.target.value)}
          />
        </div>
      </div>

      <div className="d-flex">
        <Button
          onClick={handleGen}
          type="primary"
          shape="round"
          className="mr-1 d-inline-flex align-items-center btn"
          size="medium"
          disabled={!mes}
        >
          Get data
        </Button>

        <Button
          onClick={handSub}
          type="primary"
          shape="round"
          className="ml-3 d-inline-flex align-items-center btn btn-danger"
          size="medium"
          disabled={!id || !mes}
        >
          Send data
        </Button>
      </div>
    </form>
  );

  const handSub = async (e) => {
    e.preventDefault();
    setLoading(true);
    postData(id, mes, 80000, 2000)
      .then((res) => {
        const { height, txhash, gas_used } = res.data;
        setHigh(height);
        setTxs(txhash);
        setGasUse(gas_used);
        setMes("");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleGen = (e) => {
    e.preventDefault();
    getGenData(mes)
      .then((res) => {    
        setMes(res.data.mes);
      setId(res.data.id);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const LoadInfo = () => (
    <>
      <h4 className="text-center">OK!</h4>
      <span className="text-center">Height: {hight}</span>
      <br />
      <span className="text-center">
        Gas used: <span className="text-primary">{gasUse}</span>
      </span>
      <br />
      <span className="text-center">
        TxHash:{" "}
        <a
          href={`https://testnet.mintscan.io/celestia-incentivized-testnet/txs/${txs}`}
          className="text-success"
        >
          {txs.substring(0, 20) + "..."}
        </a>
      </span>
      <br />
      <label>Info data</label>
      <textarea
        type="text"
        className="form-control"
        value={shares}
        placeholder=" Random Message"
        onChange={(e) => setShares(e.target.value)}
        rows="10"
        readOnly
      />
      <br />
    </>
  );

  return (
    <>
      <div className="row ">
        <div className="col-md-5">
          <h1 className="text-center">
            <img src={logo} alt="logo" /> Celestia
          </h1>
          <h4 className="text-center">
            Pay for blobs with Celestia's incentivized testnet
          </h4>
          <p className="text-center mb-1"></p>
          <br />
          {FormData()}
          <br />
          {loading ? (
            <div className="d-flex justify-content-center">
              <span>Loading...</span>
            </div>
          ) : validated ? (
            LoadInfo()
          ) : null}
        </div>
      </div>
    </>
  );
};

export default Hehe;

import React, { useEffect, useState, useCallback, useMemo } from "react";
import Head from 'next/head'
import { isEmpty, map, slice } from "lodash";
import { Spin, Row, Pagination, Card, Col, Tooltip, Divider, BackTop, notification } from "antd";
import { SearchProduct } from "./../components";
import { getStorage, setStorage } from "./../storage";

const { Meta } = Card;

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [allProduct, setAllProduct] = useState([]);
  const [productSearch, setProductSearch] = useState([]);
  const [pagination, setPagination] = useState({
    pageNumber: 1,
    pageSize: 10,
  })

  useEffect(() => {
    if (isEmpty(allProduct)) {
      setLoading(true);
      fetch("https://run.mocky.io/v3/7af6f34b-b206-4bed-b447-559fda148ca5")
        .then(res => res.json())
        .then(data => {
          setAllProduct(data);
          setProductSearch(data);
          setStorage("products", data);
        })
        .catch(error => {
          const data = getStorage("products");
          if (!isEmpty(data)) {
            setProductSearch(data);
            setAllProduct(data);
          } else {
            notification.open({
              message: "Notify",
              description: "Network error. Please check your network to get data first time.",
            })
          }
        })
        .finally(() => {
          setLoading(false);
        })
    }
  }, [allProduct]);

  const onChangePagination = useCallback((pageNumber, pageSize) => {
    setPagination({ pageNumber, pageSize })
  }, []);

  const data = useMemo(() => {
    const {
      pageSize,
      pageNumber
    } = pagination;

    const start = (pageNumber - 1) * pageSize;
    const end = start + pageSize;
    const result = slice(productSearch, start, end);
    return result;
  }, [pagination, productSearch]);

  const renderProduct = useCallback((product, index) => {
    const {
      name = '',
      hightLightName = '',
      price = 0,
      imageUrl = '',
      id,
      code,
    } = product;

    return (
      <Col key={`product_${id}`}>
        <Card
          cover={<img alt={code} style={{ width: 300, height: 400, margin: "auto" }} src={imageUrl} />}
          hoverable
          style={{
            width: 350,
            height: 550,
            justifyContent: 'center',
            textAlign: "center"
          }}
        >
          <Tooltip title={name}>
            <div
              style={{
                textOverflow: "ellipsis",
                overflow: "auto",
                maxWidth: 300,
                maxHeight: 70,
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                fontSize: 16,
                color: "black",
              }}
              dangerouslySetInnerHTML={{ __html: hightLightName || name }}
            />
          </Tooltip>
          <span style={{ color: 'red', marginTop: 10 }}>$ {price}</span>
        </Card>
      </Col>
    )
  }, [])

  return (
    <div className="container">
      <Head>
        <title>Catalog Applcation</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main style={{ paddingBottom: 30 }}>
        <Row style={{ alignItems: "center", padding: 30 }}>
          <img alt="Logo" src={"/favicon.ico"} style={{ backgroundColor: 'white' }} />
          <h1 style={{ margin: 0 }}>
            Matthew Computer
          </h1>
          <Divider />
          <Divider />
        </Row>
        <Spin spinning={loading}>
          <Row style={{ justifyContent: "center", alignItems: "center", flex: 1, flexDirection: "column" }}>
            <SearchProduct
              data={allProduct}
              onChange={(data) => setProductSearch(data) }
              style={{
                width: "60%"
              }}
            />
            <Row
              gutter={[16, 16]}
              style={{ justifyContent: "center", marginTop: 20 }}
            >
              { map(data, renderProduct) }
            </Row>
            <Row>
              <Pagination
                total={productSearch.length}
                onChange={onChangePagination}
                pageSize={pagination.pageSize}
                current={pagination.pageNumber}
              />
            </Row>
          </Row>
        </Spin>
        <BackTop />
      </main>
    </div>
  )
}

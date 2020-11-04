import React, { Component } from "react";
import { Route } from 'react-router-dom'
import { Navbar, NavItem, Icon } from 'react-materialize';
import { useHistory } from "react-router-dom";

import ManageStockPanel from "./components/pages/ManageStockPanel";
import ManageKeywordPanel from "./components/pages/ManageKeywordPanel";
import ManageStockList from "./components/pages/ManageStockList";
import ManageSectorPanel from "./components/pages/ManageSectorPanel";

import 'materialize-css';
import "./StockDatabaseApp.css";
import { PATH_HOME, PATH_STOCKLIST, PATH_STOCK, PATH_KEYWORDS, PATH_SECTORINDUSTRIES } from "./Constants";

const StockDatabaseApp = () => {
    const history = useHistory();

    return (
        <div>
            <Navbar
                alignLinks="left"
                brand={<div>Simple Stock DB</div>}
                centerChildren
                id="mobile-nav"
                menuIcon={<Icon>menu</Icon>}
                options={{
                    draggable: true,
                    edge: 'left',
                    inDuration: 250,
                    onCloseEnd: null,
                    onCloseStart: null,
                    onOpenEnd: null,
                    onOpenStart: null,
                    outDuration: 200,
                    preventScrolling: true
                }}
            >
                <NavItem onClick={() => { history.push(PATH_STOCKLIST) }}>
                    Stocks
                </NavItem>
                <NavItem onClick={() => { history.push(PATH_SECTORINDUSTRIES) }}>
                    Sectors/Industries
                </NavItem>
                <NavItem onClick={() => { history.push(PATH_KEYWORDS) }}>
                    Keywords
                </NavItem>
            </Navbar>
            <div>
                <Route path={PATH_HOME} exact component={ManageStockList} />
                <Route path={PATH_STOCKLIST} exact component={ManageStockList} />
                <Route path={PATH_STOCK + "/:ticker?"} component={ManageStockPanel} />
                <Route path={PATH_SECTORINDUSTRIES} component={ManageSectorPanel} />
                <Route path={PATH_KEYWORDS} component={ManageKeywordPanel} />
            </div>
        </div>
    );
}

export default StockDatabaseApp;

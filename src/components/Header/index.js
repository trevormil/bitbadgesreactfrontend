import { useState, Fragment, lazy } from "react";
import { Row, Col, Drawer } from "antd";
import { CSSTransition } from "react-transition-group";
import { withTranslation } from "react-i18next";

import * as S from "./styles";

const SvgIcon = lazy(() => import("../../common/SvgIcon"));
const Button = lazy(() => import("../../common/Button"));

const Header = ({ t }) => {
  const [isNavVisible] = useState(false);
  const [isSmallScreen] = useState(false);
  const [visible, setVisibility] = useState(false);

  const showDrawer = () => {
    setVisibility(!visible);
  };

  const onClose = () => {
    setVisibility(!visible);
  };

  const MenuItem = () => {
    return (
      <Fragment>
        <S.CustomNavLinkSmall onClick={() => (window.location.href = "/about")}>
          <S.Span>{t("About")}</S.Span>
        </S.CustomNavLinkSmall>
        <S.CustomNavLinkSmall
          onClick={() => (window.location.href = "/explore")}
        >
          <S.Span>{t("Explore")}</S.Span>
        </S.CustomNavLinkSmall>
        <S.CustomNavLinkSmall onClick={() => (window.location.href = `/view`)}>
          <S.Span>{t("View Profiles")}</S.Span>
        </S.CustomNavLinkSmall>
        <S.CustomNavLinkSmall onClick={() => (window.location.href = "/issue")}>
          <S.Span>{t("Issue Badges")}</S.Span>
        </S.CustomNavLinkSmall>
        <S.CustomNavLinkSmall style={{ width: "180px" }}>
          <S.Span>
            <Button
              onClick={() =>
                (window.location.href = `/user/${window.localStorage.getItem(
                  "username"
                )}`)
              }
            >
              {t("My Profile")}
            </Button>
          </S.Span>
        </S.CustomNavLinkSmall>
      </Fragment>
    );
  };

  return (
    <S.Header>
      <S.Container>
        <Row type="flex" justify="space-between" gutter={20}>
          <S.LogoContainer to="/" aria-label="homepage">
            <img
              height="90px"
              src={process.env.PUBLIC_URL + "/img/icons/logo.png"}
            />
          </S.LogoContainer>

          <S.NotHidden>
            <MenuItem />
          </S.NotHidden>
          <S.Burger onClick={showDrawer}>
            <S.Outline />
          </S.Burger>
        </Row>
        <Row type="flex" justify="end"></Row>
        <CSSTransition
          in={!isSmallScreen || isNavVisible}
          timeout={350}
          classNames="NavAnimation"
          unmountOnExit
        >
          <Drawer closable={false} visible={visible} onClose={onClose}>
            <Col style={{ marginBottom: "2.5rem" }}>
              <S.Label onClick={onClose}>
                <Col span={12}>
                  <S.Menu>Menu</S.Menu>
                </Col>
                <Col span={12}>
                  <S.Outline padding="true" />
                </Col>
              </S.Label>
            </Col>
            <MenuItem />
          </Drawer>
        </CSSTransition>
      </S.Container>
    </S.Header>
  );
};

export default withTranslation()(Header);

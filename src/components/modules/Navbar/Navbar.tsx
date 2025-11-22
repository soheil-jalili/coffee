import Menus from "./Menus/Menus";
import Logo from "./Logo/Logo";
import ShoppingCartAndLikes from "./ShoppingCartAndLikes/ShoppingCartAndLikes";
import Nav from "./Nav/Nav";
import Main from "../Main/Main";

const Navbar: React.FC = async () => {
  return (
    <Nav>
      <Main>
        <Logo />
        <Menus />
        <ShoppingCartAndLikes />
      </Main>
    </Nav>
  );
};

export default Navbar;

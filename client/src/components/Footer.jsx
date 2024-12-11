import React from "react";

function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <div>&copy; {currentYear} | Designed by Enes Doğan and Barış Zırhlı</div>
  );
}
export default Footer;

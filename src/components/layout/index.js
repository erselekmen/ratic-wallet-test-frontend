import styled from "@emotion/styled";
import Header from "./header";

export const Flex = styled.div`
  display: flex;
`;

export default function Layout({ children }) {
  return (
    <div>
      <Header />
      <div>{children}</div>
    </div>
  );
}

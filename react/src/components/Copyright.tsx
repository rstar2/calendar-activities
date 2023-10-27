import React from "react";

import { Link, Text, type TextProps } from "@chakra-ui/react";

export default function Copyright(props: TextProps): React.ReactElement {
  return (
    <Text variant="body2" align="center" {...props}>
      {"Copyright © "}
      <Link href="https://github.com/rstar2/" target="_blank">Rumen Neshev</Link>
      {" " + new Date().getFullYear()}
    </Text>
  );
}

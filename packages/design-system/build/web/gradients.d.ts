export default tokens;

declare interface DesignToken {
  value: any;
  name?: string;
  comment?: string;
  themeable?: boolean;
  attributes?: {
    category?: string;
    type?: string;
    item?: string;
    subitem?: string;
    state?: string;
    [key: string]: any;
  };
  [key: string]: any;
}

declare const tokens: {
  "color": {
    "gradient": {
      "blueToLightBlue": DesignToken,
      "blueToPurple": DesignToken,
      "purpleToLightPink": DesignToken,
      "purpleToPink": DesignToken,
      "blueToGreen": DesignToken,
      "lightBlueToGreen": DesignToken
    }
  }
}
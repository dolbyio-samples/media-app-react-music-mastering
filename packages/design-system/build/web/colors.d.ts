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
    "base": {
      "gray": {
        "01": DesignToken,
        "02": DesignToken,
        "03": DesignToken,
        "04": DesignToken,
        "05": DesignToken,
        "06": DesignToken
      },
      "lightBlue": {
        "01": DesignToken,
        "02": DesignToken,
        "03": DesignToken,
        "04": DesignToken,
        "05": DesignToken,
        "06": DesignToken
      },
      "blue": {
        "01": DesignToken,
        "02": DesignToken,
        "03": DesignToken,
        "04": DesignToken,
        "05": DesignToken,
        "06": DesignToken
      },
      "purple": {
        "01": DesignToken,
        "02": DesignToken,
        "03": DesignToken,
        "04": DesignToken,
        "05": DesignToken,
        "06": DesignToken
      },
      "pink": {
        "01": DesignToken,
        "02": DesignToken,
        "03": DesignToken,
        "04": DesignToken,
        "05": DesignToken,
        "06": DesignToken
      },
      "green": {
        "01": DesignToken,
        "02": DesignToken,
        "03": DesignToken,
        "04": DesignToken,
        "05": DesignToken,
        "06": DesignToken
      }
    }
  }
}
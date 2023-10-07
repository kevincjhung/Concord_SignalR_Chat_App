declare module "common" {
    type Message = {
      id: number;
      text: string;
      userId: number;
      created: Date;
      channelId: number;
    };

    type Channel = {
      id: number;
      name: string;
      created: Date;
    };

}


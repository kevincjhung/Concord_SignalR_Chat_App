declare module "common" {
    type Message = {
      id: number;
      text: string;
      userName: string;
      created: Date;
      channelId: number;
    };

    type Channel = {
      id: number;
      name: string;
      description: string;
    };

}


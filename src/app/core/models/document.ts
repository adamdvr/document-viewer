export interface DocumentPage {
  readonly number: number;
  readonly imageUrl: string;
}

export interface DocumentInfo {
  readonly name: string;
  readonly pages: readonly DocumentPage[];
}

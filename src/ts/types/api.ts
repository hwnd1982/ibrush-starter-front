export interface BaseResponse<D = any> {
  data: {
    success: boolean;
    data?: D;
    catalog?: string | null;
    error?: string;
  } | null;
  status: "error" | "success";
  errors: any[];
}

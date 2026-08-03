import api from "../api/axios";
import endpoints from "../api/endpoints";

const reportsService = {
  getIncomeExpense: (params) =>
    api.get(endpoints.reports.incomeExpense, { params }),
};

export default reportsService;

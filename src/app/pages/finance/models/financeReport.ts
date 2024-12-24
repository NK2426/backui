// Warehouse list-------------------
export class WarehouseList {
    id?: number
    name?: string
    mobile?: string
    billingaddress?: string
    address?: string
    address1?: string
    address2?: string
    pincode?: string
    gstin?: string
    createdBy?: number
}

// Daily Analysis ------------------------
export class DailyAnalysis {
    todaysOrderCount?: number
    todayOrderAmount?: any
    todayExpenseAmount?: any
    todayIncomeAmount?: any
    todayRevenueAmount?: number
}

// Revenue Chart--------------------
export class RevenueChart {
    month?: string
    data?: string
}

// GST CHart ------------------------
export class GSTChart {
    month?: string
    totalCtax?: string
    totalCtaxval?: string
    totalStax?: string
    totalStaxval?: string
    totalItax?: string
    totalItaxval?: string
}

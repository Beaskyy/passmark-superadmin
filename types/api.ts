export interface BreakdownItem {
  status?: string;
  payment_status?: string;
  count: number;
  total_amount?: string;
}

export interface AdminOverviewResponse {
  summary: {
    total_organisations: number;
    active_organisations: number;
    new_organisations: number;
    total_scripts: number;
    total_assessments: number;
    total_courses: number;
    total_students: number;
    total_credits_used: number;
    total_revenue: number;
    average_mark: number;
  };
  today_stats: {
    scripts_today: number;
    scripts_marked_today: number;
    pending_scripts: number;
  };
  monthly_stats: {
    scripts_growth_percentage: number;
    revenue_growth_percentage: string; // API returns string "-100.00"
    credits_growth_percentage: number;
  };
  breakdowns: {
    script_status: BreakdownItem[];
    payment_status: BreakdownItem[];
  };
}
using System.Collections.Generic;
using System.Linq;

namespace BookConsultant.Model
{
    public class FilteredBook : Book
    {
        public List<string> Filters { get; set; }

        public FilteredBook AddFilter(string filter)
        {
            Filters.Add(filter);
            return this;
        }
        
        public FilteredBook AddFilters(List<string> filters)
        {
            Filters = Filters.Union(filters).ToList();
            return this;
        }
    }
}
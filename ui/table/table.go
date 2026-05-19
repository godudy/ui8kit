package table

import (
	"strconv"
	"strings"

	"github.com/a-h/templ"
)

type TableProps struct {
	Class string
	Attrs templ.Attributes
}

type TableCaptionProps struct {
	Class string
}

type TableSectionProps struct {
	Class string
}

type TableRowProps struct {
	Class string
}

type TableCellProps struct {
	Class   string
	Scope   string
	ColSpan int
	RowSpan int
	Headers string
	Abbr    string
}

type TableColGroupProps struct {
	Class string
	Span  int
}

type TableColProps struct {
	Class string
	Span  int
}

func tableAttrs(p TableProps) templ.Attributes {
	attrs := templ.Attributes{}
	for k, v := range p.Attrs {
		attrs[k] = v
	}
	return attrs
}

func tableScope(scope string) string {
	switch strings.TrimSpace(strings.ToLower(scope)) {
	case "col", "colgroup", "row", "rowgroup":
		return strings.TrimSpace(strings.ToLower(scope))
	default:
		return ""
	}
}

func tableCellAttrs(p TableCellProps, heading bool) templ.Attributes {
	attrs := templ.Attributes{}
	if heading {
		if scope := tableScope(p.Scope); scope != "" {
			attrs["scope"] = scope
		}
		if strings.TrimSpace(p.Abbr) != "" {
			attrs["abbr"] = p.Abbr
		}
	}
	if p.ColSpan > 0 {
		attrs["colspan"] = strconv.Itoa(p.ColSpan)
	}
	if p.RowSpan > 0 {
		attrs["rowspan"] = strconv.Itoa(p.RowSpan)
	}
	if strings.TrimSpace(p.Headers) != "" {
		attrs["headers"] = p.Headers
	}
	return attrs
}

func spanAttrs(span int) templ.Attributes {
	if span <= 0 {
		return templ.Attributes{}
	}
	return templ.Attributes{"span": strconv.Itoa(span)}
}

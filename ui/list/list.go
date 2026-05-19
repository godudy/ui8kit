package list

import (
	"strconv"

	"github.com/a-h/templ"
	"github.com/fastygo/templ/utils"
)

type ListProps struct {
	Class string
	Tag   string
	Attrs templ.Attributes
}

type ListItemProps struct {
	Class string
	Value int
	Attrs templ.Attributes
}

func listTag(tag string) string {
	return uiutils.ResolveTag(tag, "ul", uiutils.TagGroupList)
}

func listItemAttrs(p ListItemProps) templ.Attributes {
	if p.Value <= 0 {
		return templ.Attributes{}
	}
	return templ.Attributes{"value": strconv.Itoa(p.Value)}
}

func listItemMergedAttrs(p ListItemProps) templ.Attributes {
	return uiutils.MergeAttrs(listItemAttrs(p), p.Attrs)
}

func listSpreadAttrs(p ListProps) templ.Attributes {
	return uiutils.MergeAttrs(templ.Attributes{}, p.Attrs)
}

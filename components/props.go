/**
 * Package components is the composite registry facade.
 * Import cmp "github.com/fastygo/templ/components" for Card, Alert, Breadcrumb.
 */

// Package components is the composite registry facade. Import as:
//
//	import cmp "github.com/fastygo/templ/components"
//
// Use @cmp.Card, @cmp.Alert, … Granular imports remain valid.
package components

import (
	"github.com/fastygo/templ/components/alert"
	"github.com/fastygo/templ/components/breadcrumb"
	"github.com/fastygo/templ/components/card"
)

type (
	CardProps            = card.CardProps
	CardHeaderProps      = card.CardHeaderProps
	CardTitleProps       = card.CardTitleProps
	CardDescriptionProps = card.CardDescriptionProps
	CardContentProps     = card.CardContentProps
	CardFooterProps      = card.CardFooterProps
	AlertProps           = alert.AlertProps
	BreadcrumbProps      = breadcrumb.BreadcrumbProps
	BreadcrumbItem       = breadcrumb.BreadcrumbItem
)

func CardClasses(p CardProps) string   { return card.CardClasses(p) }
func AlertClasses(p AlertProps) string { return alert.AlertClasses(p) }

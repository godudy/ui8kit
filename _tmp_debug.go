
package main
import (
    "bytes"
    "context"
    "fmt"
    "strings"
    home "github.com/fastygo/templ/examples/ui/blocks/home"
)
func main() {
    var buf bytes.Buffer
    home.Page(home.DefaultPage()).Render(context.Background(), &buf)
    html := buf.String()
    for _, s := range []string{"home-mobile-sheet-trigger", "data-ui8kit-dialog-open", "Open menu", "menu"} {
        fmt.Println(s, strings.Contains(html, s))
    }
    idx := strings.Index(html, "menu")
    if idx > 0 { fmt.Println(html[max(0,idx-200):idx+100]) }
}

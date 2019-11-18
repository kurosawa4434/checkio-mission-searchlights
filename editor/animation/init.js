//Dont change it
requirejs(['ext_editor_io', 'jquery_190', 'raphael_210'],
    function (extIO, $) {
        function searchlightsCanvas(dom, data) {

            if (! data || ! data.ext) {
                return
            }

            const [polygons, searchlights] = data.in
            const explanation = data.ext.explanation
            const answer = data.ext.answer
            const scale_max = explanation

            /*----------------------------------------------*
             *
             * attr
             *
             *----------------------------------------------*/
            const FONT_SIZE = 10
            const BG_COLOR = '#dfe8f7'
            const attr = {
                light: {
                    dark: {
                        'stroke-width' : 0,
                        'fill': 'black',
                    },
                    bright: {
                        'stroke-width' : 0,
                        'fill': 'white',
                    },
                },
                edge: {
                    dark: {
                        'stroke-width': 0.5,
                        'stroke': 'black',
                    },
                    bright: {
                        'stroke-width': 0.5,
                        'stroke': 'white',
                    },
                },
                mask: {
                    'stroke-width' : 0,
                    'fill': BG_COLOR,
                },
                scale: {
                    'font-size': FONT_SIZE,
                },
            }

            /*----------------------------------------------*
             *
             * paper
             *
             *----------------------------------------------*/
            const [os_l, os_r, os_t, os_b] = [25, 15, 10, 15]
            const [os_w, os_h] = [os_l+os_r, os_t+os_b]
            const graph_length = 300

            const paper = Raphael(dom, graph_length+os_w, graph_length+os_h, 0, 0);

            /*----------------------------------------------*
             *
             * draw
             *
             *----------------------------------------------*/
            const ratio = graph_length / scale_max

            // dark background
            paper.rect(os_l, os_t, graph_length, graph_length).attr(attr.light.dark)

            // searchlights
            let lights = paper.set()
            for (const [cx, cy, cr] of searchlights) {
                lights.push(paper.circle(cx*ratio+os_l, (scale_max - cy)*ratio+os_t, cr*ratio).attr(attr.light.dark))
            }

            // regular polygon
            let draw_polygons = paper.set()
            for (polygon of polygons) {

                let coord = []
                for (let [x, y] of make_polygon_path(...polygon)) {
                    coord = coord.concat([['M', 'L'][coord.length && 1], x*ratio+os_l, (scale_max-y)*ratio+os_t])
                }
                draw_polygons.push(paper.path(coord.concat(['Z'])).attr(attr.edge.bright))
            }

            // mask
            paper.path(
                [
                    'M', 0, 0,
                    'h', graph_length+os_w,
                    'v', graph_length+os_h,
                    'h', -(graph_length+os_w), 'Z',
                    'M', os_l, os_t,
                    'v', graph_length,
                    'h', graph_length,
                    'v', -(graph_length), 'Z'
                ]
            ).attr(attr.mask)

            // scale
            paper.text(os_l/2, os_t, scale_max).attr(attr.scale)
            paper.text(os_l/2, os_t+graph_length/2, scale_max/2).attr(attr.scale)
            paper.text(os_l/2, graph_length+os_t+os_b/2, 0).attr(attr.scale)
            paper.text(graph_length+os_l, graph_length+os_t+os_b/2, scale_max).attr(attr.scale)
            paper.text(graph_length/2+os_l, graph_length+os_t+os_b/2, scale_max/2).attr(attr.scale)
            paper.path(['M', os_l, graph_length/2+os_t, 'h', -3])
            paper.path(['M', graph_length/2+os_l, graph_length+os_t, 'v', 3])

            // spot light (on)
            if (answer > 0) {
                draw_polygons.animate(attr.edge.dark, 0)
            }
            lights.animate(attr.light.bright, 400)

            /*----------------------------------------------*
             *
             * draw polygon
             *
             *----------------------------------------------*/
            function make_polygon_path(px, py, edge_length, vertices) {

                const deg_d = 360 / vertices

                let path = [[px, py]]
                let deg_total = 180 + (90 - ((180 * (vertices-2) / vertices)/2))
                let ary_x = [px]
                let [x, y] = [px, py]

                for (let i = 0; i < vertices-1; i += 1) {
                    const rad = Math.PI*2 * ((deg_total)/360)
                    x += Math.cos(rad) * edge_length
                    y += Math.sin(rad) * edge_length
                    path.push([x, y])
                    deg_total += deg_d
                    ary_x.push(x)
                    if (x < 0 || y < 0) {
                        continue
                    }
                }
                return path
            }
        }

        var $tryit;
        var io = new extIO({
            multipleArguments: false,
            functions: {
                python: 'searchlights',
                js: 'searchlights'
            },
            animation: function($expl, data){
                searchlightsCanvas(
                    $expl[0],
                    data,
                );
            }
        });
        io.start();
    }
);

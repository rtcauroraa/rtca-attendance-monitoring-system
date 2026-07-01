<!DOCTYPE html>
<html>

<head>
    <style>
        @page {
            size: A4;
            margin: 8mm;
        }

        body {
            font-family: Arial, sans-serif;
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        td {
            width: 25%;
            /* 4 columns */
            height: 120px;
            text-align: center;
            vertical-align: top;
            padding: 5px;
        }

        img {
            width: 120px;
            height: 120px;
        }

        .name {
            font-size: 9px;
            margin-top: 3px;
            word-break: break-word;
        }

        .page-break {
            page-break-after: always;
        }
    </style>
</head>

<body>

    @foreach ($trainees->chunk(28) as $page)
    <div class="page-break">
        <table>
            @foreach ($page->chunk(4) as $row)
            <tr>
                @foreach ($row as $trainee)
                <td>
                    <img src="{{ public_path('storage/' . $trainee->qr_code) }}">
                    <div class="name">
                        {{ $trainee->first_name }} {{ $trainee->last_name }}
                    </div>
                </td>
                @endforeach
            </tr>
            @endforeach
        </table>
    </div>
    @endforeach

</body>

</html>
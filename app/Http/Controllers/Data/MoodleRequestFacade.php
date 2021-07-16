<?php

namespace App\Http\Controllers\Data;

use Illuminate\Support\Facades\DB;
use GuzzleHttp\Client;
use App\Models\ViewMoodle;

class MoodleRequestFacade
{
    /**
     * Create a new instance.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    public function makeMoodleApiRequest($moodleId, $moodleFunction, $params = [])
    {
        $moodle = ViewMoodle::findOrFail($moodleId);
        $url = $moodle->url;
        $token = $moodle->token;
        $results = null;
        $client = new Client();
        $paramsString = "";
        foreach ($params as $key => $value) {
            $paramsString .= "&" . $key . "=" . $value;
        }
        $res = $client->request('GET', $url . '/webservice/rest/server.php?wstoken=' . $token .
            '&wsfunction=' . $moodleFunction . '&moodlewsrestformat=json' . $paramsString, []);
        if ($res->getStatusCode() == 200) {
            $results = $res->getBody()->getContents();
            $results = json_decode($results, true);
        }
        return $results;
    }

    //
}
